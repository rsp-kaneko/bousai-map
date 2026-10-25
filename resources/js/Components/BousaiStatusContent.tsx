import { JmaObservationPoint, JmaQuake, JmaScale } from "@/types/p2pquake"
import { CardContent, Grid, Stack, Typography } from "@mui/material"
import { FC, useEffect, useMemo, useState } from "react"
import DarkCard from "./Cards/DarkCard"
import CurrentClock from "./CurrentClock"
import useBousai from "@/Hooks/useBousai"
import { AccessTime, Equalizer } from "@mui/icons-material"
import OutlinedCard from "./Cards/OutlinedCard"
import CustomAlert from "./Alerts/CustomAlert"
import HypocenterMobileContent from "./HypocenterMobileContent"
import AreaStatusContent from "./AreaStatusContent"

type Props = {
    selectedHistory: JmaQuake | null
}

const BousaiStatusContent: FC<Props> = ({
    selectedHistory
}) => {
    const {formatScale, getScaleColor, formatTsunami, getTsunamiColor} = useBousai()
    const [selectedPref, setSelectedPref] = useState<{pref: string, scale: JmaScale} | null>(null)
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

            {/* 震源地ステータス（Mobile） */}
            <Grid size={{xs: 12, md: 0}} sx={{display: {xs: "block", md: "none"}}}>
                <HypocenterMobileContent
                    selectedHistory={selectedHistory}
                    maxScale={maxScale}
                />
            </Grid>

            {/* 震度＆津波情報 */}
            <Grid size={{xs: 12, xl: 6}} sx={{display: {xs: "none", md: "block"}}}>
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

            <Grid size={12} sx={{display: {xs: "none", md: "block"}}}>
                <AreaStatusContent
                    points={points}
                    pointPrefs={pointPrefs}
                    selectedPref={selectedPref}
                    setSelectedPref={setSelectedPref}
                />
            </Grid>

        </Grid>
    )
}

export default BousaiStatusContent
