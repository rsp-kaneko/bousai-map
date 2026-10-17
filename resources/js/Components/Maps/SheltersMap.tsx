import { PointLayer } from "@/types/pointLayer"
import { FC } from "react"
import RootMapContainer from "./RootMapContainer"
import L, { LatLngExpression } from "leaflet"
import { Marker, Popup } from "react-leaflet"
import DarkCard from "../Cards/DarkCard"
import { Box, CardContent, Chip, Divider, Stack, Typography } from "@mui/material"

type ShelterProperties = {
    "施設・場所名"?: string
    "都道府県名及び市町村名"?: string
    "住所"?: string
    "受入対象者"?: string
    "備考"?: string
    "その他市町村長が必要と認める事項"?: string
    [key: string]: any
}

type Props = {
    shelters: PointLayer[]
}

const SheltersMap: FC<Props> = ({shelters}) => {
    const latlngArray: [number, number] = JSON.parse(shelters[0].latlng)
    const latlng: LatLngExpression | undefined = [latlngArray[1], latlngArray[0]]

    return (
        <RootMapContainer
            height={{xs: 400, md: 700}}
            center={latlng}
            zoom={16}
        >
            {shelters.map((point) => {
                const positionJson = JSON.parse(point.latlng)
                const position: LatLngExpression | undefined = [positionJson[1], positionJson[0]]
                const propertiesJson: ShelterProperties = JSON.parse(point.properties)

                const pulseIcon = L.divIcon({
                    className: 'custom-pulse-marker',
                    html: `
                        <div class="pulse-icon-wrapper" style="position: relative;">
                            <div class="pulse-shelter-icon-ring"></div>
                            <div class="pulse-shelter-icon-ring delay"></div>
                            <div class="pulse-shelter-icon-center"></div>
                        </div>
                    `,
                    iconSize: [40, 40],
                    iconAnchor: [20, 20],
                })

                return (
                    <Marker
                        position={position}
                        icon={pulseIcon}
                        key={point.id}
                    >
                        <Popup className="shelter-popup">
                            <DarkCard width={300}>
                                <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                                    {/* ヘッダー: 自治体Chip & 施設名 */}
                                    <Box sx={{ mb: 1.5 }}>
                                        {propertiesJson["都道府県名及び市町村名"] && (
                                            <Chip
                                                label={propertiesJson["都道府県名及び市町村名"]}
                                                size="small"
                                                sx={{
                                                    backgroundColor: 'rgba(0, 170, 255, 0.15)',
                                                    color: '#00b0ff',
                                                    fontWeight: 'bold',
                                                    fontSize: '0.75rem',
                                                    height: '22px',
                                                    mb: 1,
                                                    border: '1px solid rgba(0, 170, 255, 0.3)'
                                                }}
                                            />
                                        )}
                                        <Typography
                                            variant="subtitle1"
                                            component="h3"
                                            sx={{
                                                fontWeight: 'bold',
                                                color: '#fff',
                                                lineHeight: 1.3
                                            }}
                                        >
                                            {propertiesJson["施設・場所名"] || "名称未設定"}
                                        </Typography>
                                    </Box>

                                    <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.12)', mb: 1.5 }} />

                                    {/* 各項目のリスト */}
                                    <Stack spacing={1.5}>
                                        {/* 住所 */}
                                        <Box>
                                            <Typography variant="caption" sx={{ color: '#aaa', fontWeight: 600, display: 'block' }}>
                                                住所
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: '#eee', wordBreak: 'break-all' }}>
                                                {propertiesJson["住所"] || "-"}
                                            </Typography>
                                        </Box>

                                        {/* 受入対象者 */}
                                        <Box>
                                            <Typography variant="caption" sx={{ color: '#aaa', fontWeight: 600, display: 'block' }}>
                                                受入対象者
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: '#eee', wordBreak: 'break-all' }}>
                                                {propertiesJson["受入対象者"] || "-"}
                                            </Typography>
                                        </Box>

                                        {/* 備考 */}
                                        {propertiesJson["備考"] && (
                                            <Box>
                                                <Typography variant="caption" sx={{ color: '#aaa', fontWeight: 600, display: 'block' }}>
                                                    備考
                                                </Typography>
                                                <Box sx={{
                                                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                                    p: 1,
                                                    borderRadius: 1,
                                                    border: '1px solid rgba(255, 255, 255, 0.1)'
                                                }}>
                                                    <Typography variant="caption" sx={{ color: '#ddd', whiteSpace: 'pre-wrap', wordBreak: 'break-all', display: 'block' }}>
                                                        {propertiesJson["備考"]}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        )}

                                        {/* その他市町村長が必要と認める事項 */}
                                        {propertiesJson["その他市町村長が必要と認める事項"] && (
                                            <Box>
                                                <Typography variant="caption" sx={{ color: '#aaa', fontWeight: 600, display: 'block' }}>
                                                    その他市町村長が必要と認める事項
                                                </Typography>
                                                <Box sx={{
                                                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                                    p: 1,
                                                    borderRadius: 1,
                                                    border: '1px solid rgba(255, 255, 255, 0.1)'
                                                }}>
                                                    <Typography variant="caption" sx={{ color: '#ddd', whiteSpace: 'pre-wrap', wordBreak: 'break-all', display: 'block' }}>
                                                        {propertiesJson["その他市町村長が必要と認める事項"]}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        )}
                                    </Stack>
                                </CardContent>
                            </DarkCard>
                        </Popup>
                    </Marker>
                )
            })}
        </RootMapContainer>
    )
}

export default SheltersMap
