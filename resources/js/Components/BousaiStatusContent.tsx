import { JmaObservationPoint, JmaQuake, JmaScale } from "@/types/p2pquake"
import { alpha, Box, Button, CardContent, Grid, Stack, Typography } from "@mui/material"
import { FC, useEffect, useMemo, useState } from "react"
import DarkCard from "./Cards/DarkCard"
import CurrentClock from "./CurrentClock"
import useBousai from "@/Hooks/useBousai"
import { AccessTime, Apartment, Equalizer, Place, Warning } from "@mui/icons-material"
import OutlinedCard from "./Cards/OutlinedCard"
import CustomAlert from "./Alerts/CustomAlert"
import SheltersMapDialog from "./SheltersMapDialog"

type Props = {
    selectedHistory: JmaQuake | null
}

const BousaiStatusContent: FC<Props> = ({
    selectedHistory
}) => {
    const {formatScale, getScaleColor, formatTsunami, getTsunamiColor} = useBousai()
    const [selectedPref, setSelectedPref] = useState<{pref: string, scale: JmaScale} | null>(null)
    const [sheltersDialogStatus, setSheltersDialogStatus] = useState({
        open: false,
        prefectureName: '',
        localName: ''
    })
    const actionDateTime: string | undefined = selectedHistory?.earthquake?.time
    const maxScale = selectedHistory?.earthquake?.maxScale
    const scaleColor = maxScale !== undefined ? getScaleColor(maxScale) : '#757575'
    const scaleValue = maxScale !== undefined ? formatScale(maxScale) : '情報なし'
    const tsunamiColor = getTsunamiColor(selectedHistory?.earthquake?.domesticTsunami)
    const tsunamiValue = formatTsunami(selectedHistory?.earthquake?.domesticTsunami)
    const points: JmaObservationPoint[] = selectedHistory?.points ?? []
    const pointPrefs: Array<{pref: string, scale: JmaScale}> = useMemo(() => {
        const prefs: Array<{pref: string, scale: JmaScale}> = []
        points.forEach((point) => {
            const isPref = prefs.find((data) => data.pref === point.pref) != null
            if (!isPref) prefs.push({pref: point.pref, scale: point.scale})
        })
        return prefs
    }, [points])

    useEffect(() => {
        if (pointPrefs.length > 0) {
            setSelectedPref(pointPrefs[0])
        } else {
            setSelectedPref(null)
        }
    }, [pointPrefs])

    return (
        <Grid container spacing={2}>

            {/* 震度＆津波情報 */}
            <Grid size={{xs: 12, xl: 6}}>
                <OutlinedCard height="100%" bgcolor={scaleColor} textColor="#fff">
                    <CardContent>
                        <Typography
                            component='h1'
                            sx={{
                                fontSize: {xs: '1.3rem', md: '1.5rem'},
                                fontWeight: 'bold',
                                display: 'flex',
                                alignItems: 'center'
                            }}
                        >
                            <Equalizer sx={{color: scaleColor, fontSize: '2.5rem', mr: 1}} />
                            最大{scaleValue}
                        </Typography>
                        <CustomAlert
                            color={tsunamiColor}
                            message={tsunamiValue}
                        />
                    </CardContent>
                </OutlinedCard>
            </Grid>

            {/* 発生日時 */}
            <Grid size={{xs: 12, xl: 6}}>
                <DarkCard height="100%">
                    <CardContent>
                        <Stack spacing={2}>
                            <Typography component='h5' sx={{
                                borderBottom: '1px solid #aaa',
                                pb: 0.5,
                                alignItems: 'center',
                                display: 'flex'
                            }}>
                                <AccessTime sx={{mr: 1}} />
                                発生日時
                            </Typography>
                            <CurrentClock actionDateTime={actionDateTime} />
                        </Stack>
                    </CardContent>
                </DarkCard>
            </Grid>

            {/* 都道府県別 */}
            <Grid size={12}>
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
            </Grid>

            {/* 市区町村別 */}
            <Grid size={12}>
                <DarkCard>
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
            </Grid>

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
        </Grid>
    )
}

export default BousaiStatusContent
