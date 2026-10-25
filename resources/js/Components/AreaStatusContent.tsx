import { JmaObservationPoint, JmaScale } from "@/types/p2pquake"
import { Dispatch, FC, SetStateAction, useState } from "react"
import DarkCard from "./Cards/DarkCard"
import { alpha, Box, Button, CardContent, Stack, Typography } from "@mui/material"
import { Apartment, Place, Warning } from "@mui/icons-material"
import useBousai from "@/Hooks/useBousai"
import SheltersMapDialog from "./SheltersMapDialog"

type Props = {
    points: JmaObservationPoint[]
    pointPrefs: Array<{pref: string, scale: JmaScale}>
    selectedPref: {pref: string, scale: JmaScale} | null
    setSelectedPref: Dispatch<SetStateAction<{pref: string, scale: JmaScale} | null>>
}

const AreaStatusContent: FC<Props> = ({
    points,
    pointPrefs,
    selectedPref,
    setSelectedPref
}) => {
    const {getScaleColor, formatScale} = useBousai()
    const [sheltersDialogStatus, setSheltersDialogStatus] = useState({
        open: false,
        prefectureName: '',
        localName: ''
    })

    return (
        <>
            {/* 都道府県別 */}
            <DarkCard>
                <CardContent>
                    <Stack spacing={2}>
                        <Typography component='h5' sx={{
                            borderBottom: '1px solid #aaa',
                            pb: 0.5,
                            alignItems: 'center',
                            display: 'flex'
                        }}>
                            <Place sx={{mr: 1}} />
                            発生エリア
                        </Typography>
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            overflowX: 'auto',
                            scrollbarWidth: 'thin',
                            gap: 1
                        }}>
                            {pointPrefs.length === 0 && (
                                <Box sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1
                                }}>
                                    <Warning />
                                    <Typography component="span">不明です</Typography>
                                </Box>
                            )}
                            {pointPrefs.length !== 0 && pointPrefs.map((data, index) => {
                                const color: string = getScaleColor(data.scale)
                                return (
                                    <Button
                                        key={index}
                                        variant="outlined"
                                        onClick={() => setSelectedPref(data)}
                                        sx={data.pref === selectedPref?.pref ? {
                                            borderColor: color,
                                            backgroundColor: alpha(color, 0.6),
                                            color: '#fff',
                                            wordBreak: 'keep-all'
                                        } : {
                                            color: color,
                                            borderColor: color,
                                            wordBreak: 'keep-all',
                                            '&:hover': {
                                                borderColor: color,
                                                backgroundColor: alpha(color, 0.6),
                                                color: '#fff'
                                            },
                                        }}
                                    >
                                        {data.pref}
                                    </Button>
                                )
                            })}
                        </Box>
                    </Stack>
                </CardContent>
            </DarkCard>

            {/* 市区町村別 */}
            <DarkCard mt={2}>
                <CardContent>
                    <Stack spacing={2}>
                        <Box sx={{
                            borderBottom: '4px solid ' + (selectedPref ? getScaleColor(selectedPref.scale) : '#757575'),
                            pb: 0.5,
                            alignItems: 'center',
                            display: 'flex',
                            gap: 1
                        }}>
                            <Apartment />
                            <Typography component="p">市区町村</Typography>
                            <span>｜</span>
                            <Typography component="span">
                                {selectedPref ? `${selectedPref.pref}内` : 'エリア不明'}
                                ：
                                {selectedPref ? formatScale(selectedPref.scale) : '情報なし'}
                            </Typography>
                        </Box>
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            gap: 1,
                            maxHeight: 150,
                            overflowY: 'auto',
                            scrollbarWidth: 'none'
                        }}>
                            {!selectedPref && (
                                <Box sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1
                                }}>
                                    <Warning />
                                    <Typography component="span">不明です</Typography>
                                </Box>
                            )}
                            {selectedPref && points.map((point, index) => point.pref === selectedPref.pref && (
                                    <Button
                                        key={index}
                                        variant="outlined"
                                        onClick={() =>
                                            setSheltersDialogStatus({
                                                open: true,
                                                prefectureName: selectedPref.pref,
                                                localName: point.addr
                                            })
                                        }
                                    >
                                        {point.addr}
                                    </Button>
                                )
                            )}
                        </Box>
                    </Stack>
                </CardContent>
            </DarkCard>

            <SheltersMapDialog
                status={sheltersDialogStatus}
                onReset={() =>
                    setSheltersDialogStatus({
                        open: false,
                        prefectureName: '',
                        localName: ''
                    })
                }
            />
        </>
    )
}

export default AreaStatusContent
