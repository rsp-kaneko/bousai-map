<?php

namespace App\Http\Controllers;

use App\Http\Requests\PrefectureRequest;
use App\Models\CoastLine;
use App\Models\Prefecture;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class CoastLineController extends Controller
{
    // 都道府県毎の海岸線ラインデータ取得
    public function getLines(PrefectureRequest $request)
    {
        try {
            $prefectureNames = $request->input('prefectureNames', []);
            if (empty($prefectureNames)) {
                return response()->json(['coastLines' => []], Response::HTTP_OK);
            }

            $coastLines = CoastLine::with(['prefecture' => function ($query) {
                    $query->where('delete_flg', 0);
                }])
                ->whereIn('name', $prefectureNames)
                ->where('delete_flg', 0)
                ->get();

            return response()->json(['coastLines' => $coastLines], Response::HTTP_OK);

        } catch (Exception $e) {
            Log::error('/coastLines/getLines: ' . $e->getMessage(), ['exception' => $e]);
            return response()->json(['error' => $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    // 海岸線ラインデータGeoJson取り込み
    public function storeLines(Request $request)
    {
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

            if (!isset($geoJson['type']) || !isset($geoJson['features'])) {
                return response()->json([
                    'error' => '有効なGeoJSON形式（FeatureCollection）ではありません。'
                ], Response::HTTP_BAD_REQUEST);
            }

            $features = $geoJson['features'];
            // 事前に都道府県マスタを「名前 => ID」で取得（SQL発行を1回にする）
            $prefecture_map = Prefecture::where('delete_flg', 0)->pluck('id', 'name');

            DB::transaction(function () use ($features, $prefecture_map) {
                foreach ($features as $feature) {
                    $prefecture_name = $feature['properties']['pref_name_en'] ?? null;
                    $prefecture_id = $prefecture_map[$prefecture_name];
                    $geometry = $feature['geometry'];
                    $coordinates = $geometry['coordinates'] ?? [];

                    CoastLine::create([
                        'prefecture_id' => $prefecture_id,
                        'name' => $prefecture_name,
                        'latlngs' => json_encode($coordinates) // 配列をJSON文字列化して保存
                    ]);
                }
            });
            return response()->json([], Response::HTTP_OK);

        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::error('storeLines validation error:', $e->errors());
            return response()->json(['error' => $e->errors()], Response::HTTP_UNPROCESSABLE_ENTITY);
        } catch (Exception $e) {
            Log::error('storeLines error: ' . $e->getMessage(), [
                'exception' => $e
            ]);
            return response()->json(['error' => $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
