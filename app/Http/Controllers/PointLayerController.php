<?php

namespace App\Http\Controllers;

use App\Models\PointLayer;
use App\Models\Prefecture;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class PointLayerController extends Controller
{
    //
    public function getShelters(Request $request)
    {
        try {
            $prefecture_name = $request->input('prefectureName');
            $local_name = $request->input('localName');
            $prefecture = Prefecture::where('name', $prefecture_name)
                ->where('delete_flg', 0)
                ->first();

            $shelters = [];
            if ($prefecture !== null) {
                $shelters = PointLayer::with(['prefecture' => function ($query) {
                    $query->where('delete_flg', 0);
                }])
                    ->where('prefecture_id', $prefecture->id)
                    ->where('local_name', 'LIKE', "{$local_name}%")
                    ->whereIn('class_name', ['全国指定避難所', '全国指定緊急避難場所'])
                    ->where('delete_flg', 0)
                    ->get();
            }
            return response()->json(['shelters' => $shelters], Response::HTTP_OK);

        } catch (Exception $e) {
            return response()->json(['error' => $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function storePoints(Request $request)
    {
        // 大容量GeoJSON取り込み用に一時的にメモリと実行時間を拡張
        ini_set('memory_limit', '1024M');
        set_time_limit(300);

        try {
            $request->validate([
                'file' => ['required', 'file', 'mimes:json,geojson,txt']
            ]);

            $file = $request->file('file');
            $geoJson = json_decode($file->getContent(), true);

            if (json_last_error() !== JSON_ERROR_NONE) {
                return response()->json([
                    'error' => 'GeoJSONのJSON形式が不正です: ' . json_last_error_msg()
                ], Response::HTTP_BAD_REQUEST);
            }

            if (!isset($geoJson['type']) || !isset($geoJson['features']) || !is_array($geoJson['features'])) {
                return response()->json([
                    'error' => '有効なGeoJSON形式（FeatureCollection）ではありません。'
                ], Response::HTTP_BAD_REQUEST);
            }

            $features = $geoJson['features'];
            $first_feature = $features[0] ?? null;
            if ($first_feature !== null && (($first_feature['geometry']['type'] ?? '') !== 'Point')) {
                return response()->json([
                    'error' => 'ポイントデータではありません。'
                ], Response::HTTP_BAD_REQUEST);
            }

            // 事前に都道府県マスタを「名前 => ID」で取得（SQL発行を1回にする）
            $prefecture_map = Prefecture::where('delete_flg', 0)->pluck('id', 'name');
            $class_name = $geoJson['name'] ?? '指定緊急避難場所';

            $now = now();
            $insert_data = [];

            DB::transaction(function() use ($features, $prefecture_map, $class_name, $now, &$insert_data) {
                foreach ($features as $feature) {
                    $latlng = $feature['geometry']['coordinates'] ?? [];
                    $properties = $feature['properties'] ?? null;
                    $raw_local_name = $properties['住所'] ?? '';

                    // 都道府県名とID
                    $prefecture_name = '';
                    if (preg_match('/^(東京都|北海道|京都府|大阪府|.{2,3}県)(.*)$/u', $raw_local_name, $matches)) {
                        $prefecture_name = $matches[1];
                    }
                    $prefecture_id = $prefecture_map[$prefecture_name] ?? null;

                    // 番地番号を除いた市区町村名
                    $local_name_pattern = '/^(?:東京都|北海道|大阪府|京都府|.{2,3}県)|[0-9０-９\-−ー丁目番地号]+$/u';
                    $local_name = preg_replace($local_name_pattern, '', $raw_local_name);

                    $insert_data[] = [
                        'prefecture_id' => $prefecture_id,
                        'class_name'    => $class_name,
                        'local_name'    => $local_name,
                        'latlng'        => json_encode($latlng),
                        'properties'    => json_encode($properties),
                        'created_at'    => $now,
                        'updated_at'    => $now,
                    ];

                    // 1,000件ごとにバルクインサートして配列を解放
                    if (count($insert_data) >= 1000) {
                        PointLayer::insert($insert_data);
                        $insert_data = [];
                    }
                }

                // 残りのデータをインサート
                if (!empty($insert_data)) {
                    PointLayer::insert($insert_data);
                }
            });

            return response()->json([], Response::HTTP_OK);

        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::error('[ERROR] /pointLayers/storePoints validation error: ', $e->errors());
            return response()->json([
                'error' => implode(' ', \Illuminate\Support\Arr::flatten($e->errors()))
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        } catch (Exception $e) {
            Log::error('[ERROR] /pointLayers/storePoints： '.$e->getMessage(), [
                'exception' => $e
            ]);
            return response()->json([
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
