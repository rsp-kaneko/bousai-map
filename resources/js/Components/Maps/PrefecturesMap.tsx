import { Dispatch, FC, SetStateAction, useEffect, useMemo } from "react"
import RootMapContainer from "./RootMapContainer"
import usePrefecture from "@/Hooks/usePrefecture"
import { GeoJSON } from "react-leaflet"
import type { Feature, MultiLineString, MultiPolygon } from "geojson"
import { JmaHypocenter, JmaObservationPoint, JmaQuake, JmaScale, JmaTsunami, JmaTsunamiArea } from "@/types/p2pquake"
import { Box } from "@mui/material"
import MapLoadingViewer from "./MapLoadingViewer"
import useBousai from "@/Hooks/useBousai"
import EpicenterMarker from "./EpicenterMarker"
import { LatLngExpression } from "leaflet"
import HypocenterContent from "./HypocenterContent"
import useCoastLine from "@/Hooks/useCoastLine"
import MobileAreaButton from "./MobileAreaButton"

type Props = {
    selectedHistory: JmaQuake | null
    setSelectedHistory: Dispatch<SetStateAction<JmaQuake | null>>
    p2pHistories: JmaQuake[]
    tsunamiHistories: JmaTsunami | null
}

const PrefecturesMap: FC<Props> = ({
    selectedHistory,
    setSelectedHistory,
    p2pHistories,
    tsunamiHistories
}) => {
    const { isLoad, prefectures, getPrefecturePolygons } = usePrefecture()
    const { getCoastLines, coastLines } = useCoastLine()
    const {getScaleColor, getTsunamiGradeColor} = useBousai()

    const points: JmaObservationPoint[] = selectedHistory?.points ?? []
    const maxScale: JmaScale | null = selectedHistory?.earthquake.maxScale ?? null
    const hypocenter: JmaHypocenter | null = selectedHistory?.earthquake.hypocenter ?? null
    const mapCenterPosition: LatLngExpression | undefined = useMemo(() => {
        if (hypocenter && hypocenter.latitude != null && hypocenter.longitude != null) {
            return [hypocenter.latitude, hypocenter.longitude]
        }
    }, [selectedHistory, hypocenter])

    const pointPrefNames: string[] = useMemo(() => {
        const prefNames: string[] = []
        points.forEach((point) => !prefNames.includes(point.pref) && prefNames.push(point.pref))
        return prefNames
    }, [selectedHistory])

    useEffect(() => {
        getPrefecturePolygons(pointPrefNames)
    }, [selectedHistory])

    useEffect(() => {
        if (tsunamiHistories) {
            const prefectureNames: string[] = []
            const areas: JmaTsunamiArea[] | undefined = tsunamiHistories.areas
            areas && areas.forEach((area) => {
                const match = area.name.match(/^(東京都|北海道|(?:京都|大阪)府|.{2,3}県)/)
                if (match) {
                    const prefName = match[0]
                    if (!prefectureNames.includes(prefName)) {
                        prefectureNames.push(prefName)
                    }
                }
            })
            getCoastLines(prefectureNames)
        }
    }, [tsunamiHistories])

    return (
        <Box sx={{position: 'relative'}}>
            {isLoad && (
                <MapLoadingViewer />
            )}

            {/* 地震情報（PC用） */}
            <HypocenterContent
                hypocenter={hypocenter}
                maxScale={maxScale!}
            />

            {/* 詳細ボタン（スマホ用） */}
            <MobileAreaButton
                selectedHistory={selectedHistory}
                setSelectedHistory={setSelectedHistory}
                p2pHistories={p2pHistories}
                tsunamiHistories={tsunamiHistories}
            />

            <RootMapContainer zoom={7} height={{xs: "65vh", md: 700}} center={mapCenterPosition}>

                {/* 震源地ポイントレイヤー */}
                {hypocenter && hypocenter.latitude != null && hypocenter.longitude != null && (
                    <EpicenterMarker position={mapCenterPosition} />
                )}

                {/* 都道府県ポリゴンレイヤー */}
                {prefectures.map((prefecture) => {
                    if (!prefecture.prefecture_polygon?.latlngs) return null

                    const prefName: string = prefecture.name
                    const targetPoint: JmaObservationPoint | null = points.find((point) => point.pref === prefName) ?? null
                    const scaleColor: string = targetPoint ? getScaleColor(targetPoint.scale) : '#757575'

                    const feature: Feature<MultiPolygon> = {
                        type: "Feature",
                        geometry: {
                            type: "MultiPolygon",
                            coordinates: JSON.parse(prefecture.prefecture_polygon.latlngs),
                        },
                        properties: { name: prefecture.name },
                    }
                    return (
                        <GeoJSON
                            key={prefecture.id}
                            data={feature}
                            style={{
                                color: '#fff', // 境界線の色（紫）
                                fillColor: scaleColor, // 塗りつぶしの色
                                fillOpacity: 0.35, // 透過度
                                weight: 2,
                            }}
                        />
                    )
                })}

                {/* 津波範囲ラインレイヤー */}
                {coastLines.map((coastLine) => {
                    if (!coastLine.latlngs) return null

                    const areas: JmaTsunamiArea[] | undefined = tsunamiHistories?.areas
                    const targetArea: JmaTsunamiArea | null = areas?.find((area) => area.name.includes(coastLine.name)) ?? null
                    const gradeColor: string = targetArea ? getTsunamiGradeColor(targetArea.grade!) : '#777'
                    const feature: Feature<MultiLineString> = {
                        type: "Feature",
                        geometry: {
                            type: "MultiLineString",
                            coordinates: JSON.parse(coastLine.latlngs),
                        },
                        properties: { name: coastLine.name },
                    }
                    return (
                        <GeoJSON
                            key={coastLine.id}
                            data={feature}
                            style={{
                                color: gradeColor, // 塗りつぶしの色
                                weight: 5
                            }}
                        />
                    )
                })}
            </RootMapContainer>
        </Box>
    )
}

export default PrefecturesMap

