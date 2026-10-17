<?php

namespace App\Http\Controllers;

use App\Http\Requests\PrefectureRequest;
use Exception;
use App\Models\Prefecture;
use App\Models\PrefecturePolygon;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class PrefectureController extends Controller
{
    //
    public function getAll()
    {
        try {
            $prefectures = Prefecture::where('delete_flg', 0)->get();
            $response = ['prefectures' => $prefectures];
            return response()->json($response, Response::HTTP_OK);

        } catch(Exception $e) {
            Log::error('/prefectures/getAll: ' . $e->getMessage(), ['exception' => $e]);
            $response = ['error' => $e->getMessage()];
            return response()->json($response, Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function getPolygons(PrefectureRequest $request)
    {
        try {
            $prefectureNames = $request->input('prefectureNames', []);
            if (empty($prefectureNames)) {
                return response()->json(['prefectures' => []], Response::HTTP_OK);
            }

            $prefectures = Prefecture::with(['prefecturePolygon' => function ($query) {
                    $query->where('delete_flg', 0);
                }])
                ->whereIn('name', $prefectureNames)
                ->where('delete_flg', 0)
                ->get();

            return response()->json(['prefectures' => $prefectures], Response::HTTP_OK);

        } catch (Exception $e) {
            Log::error('/prefectures/getPolygons: ' . $e->getMessage(), ['exception' => $e]);
            return response()->json(['error' => $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function storePolygons(Request $request)
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

            // 各都道府県別の県庁所在地の座標
            $prefectureCoordinates = [
                '北海道' => [43.0642, 141.3469],
                '青森県' => [40.8244, 140.7400],
                '岩手県' => [39.7036, 141.1527],
                '宮城県' => [38.2688, 140.8719],
                '秋田県' => [39.7186, 140.1024],
                '山形県' => [38.2404, 140.3636],
                '福島県' => [37.7503, 140.4676],
                '茨城県' => [36.3418, 140.4468],
                '栃木県' => [36.5657, 139.8836],
                '群馬県' => [36.3907, 139.0604],
                '埼玉県' => [35.8570, 139.6489],
                '千葉県' => [35.6051, 140.1233],
                '東京都' => [35.6895, 139.6917],
                '神奈川県' => [35.4478, 139.6425],
                '新潟県' => [37.9022, 139.0232],
                '富山県' => [36.6953, 137.2113],
                '石川県' => [36.5947, 136.6256],
                '福井県' => [36.0652, 136.2216],
                '山梨県' => [35.6639, 138.5684],
                '長野県' => [36.6513, 138.1810],
                '岐阜県' => [35.3912, 136.7223],
                '静岡県' => [34.9770, 138.3831],
                '愛知県' => [35.1802, 136.9066],
                '三重県' => [34.7303, 136.5086],
                '滋賀県' => [35.0045, 135.8686],
                '京都府' => [35.0211, 135.7556],
                '大阪府' => [34.6863, 135.5200],
                '兵庫県' => [34.6913, 135.1831],
                '奈良県' => [34.6853, 135.8327],
                '和歌山県' => [34.2260, 135.1675],
                '鳥取県' => [35.5039, 134.2377],
                '島根県' => [35.4723, 133.0505],
                '岡山県' => [34.6618, 133.9344],
                '広島県' => [34.3963, 132.4594],
                '山口県' => [34.1860, 131.4705],
                '徳島県' => [34.0658, 134.5594],
                '香川県' => [34.3402, 134.0433],
                '愛媛県' => [33.8416, 132.7657],
                '高知県' => [33.5597, 133.5311],
                '福岡県' => [33.6068, 130.4181],
                '佐賀県' => [33.2494, 130.2988],
                '長崎県' => [32.7503, 129.8677],
                '熊本県' => [32.7898, 130.7417],
                '大分県' => [33.2382, 131.6126],
                '宮崎県' => [31.9111, 131.4239],
                '鹿児島県' => [31.5602, 130.5581],
                '沖縄県' => [26.2124, 127.6809],
            ];

            DB::transaction(function () use ($features, $prefecture_map, $prefectureCoordinates) {
                foreach ($features as $feature) {
                    $prefecture_name = $feature['properties']['name'] ?? null;
                    $prefecture_id = $prefecture_map[$prefecture_name];
                    $geometry = $feature['geometry'];
                    $coordinates = $geometry['coordinates'] ?? [];
                    $point = $prefectureCoordinates[$prefecture_name] ?? null;

                    PrefecturePolygon::create([
                        'prefecture_id' => $prefecture_id,
                        'name' => $prefecture_name,
                        'point' => json_encode($point),
                        'latlngs' => json_encode($coordinates) // 配列をJSON文字列化して保存
                    ]);
                }
            });
            return response()->json([], Response::HTTP_OK);

        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::error('storePolygons validation error:', $e->errors());
            return response()->json(['error' => $e->errors()], Response::HTTP_UNPROCESSABLE_ENTITY);
        } catch (Exception $e) {
            Log::error('storePolygons error: ' . $e->getMessage(), [
                'exception' => $e
            ]);
            return response()->json(['error' => $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
