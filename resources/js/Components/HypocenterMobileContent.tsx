import useBousai from "@/Hooks/useBousai"
import { JmaQuake, JmaScale } from "@/types/p2pquake"
import { alpha, Box, CardContent, CardHeader, Divider, Grid, Typography } from "@mui/material"
import { FC } from "react"
import DarkCard from "./Cards/DarkCard"
import { Equalizer } from "@mui/icons-material"

type Props = {
    selectedHistory: JmaQuake | null
    maxScale: JmaScale | undefined
}

const HypocenterMobileContent: FC<Props> = ({
    selectedHistory,
    maxScale
}) => {
    const {formatScale, getScaleColor} = useBousai()
    const hypocenter = selectedHistory?.earthquake.hypocenter

    return (
        <DarkCard
            bgcolor={getScaleColor(maxScale!)}
        >
            <CardHeader
                title={
                    <Box sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1
                    }}>
                        <Equalizer sx={{color: "#fff", fontSize: '2.5rem'}} />
                        最大{formatScale(maxScale!)}
                    </Box>
                }
            />
            <Divider sx={{borderColor: "#fff"}} />
            <CardContent>
                <Grid container sx={{
                    backgroundColor: alpha("#fff", 0.2),
                    p: 1,
                    borderRadius: 2
                }}>
                    <Grid size={6} sx={{textAlign: "center"}}>
                        <Typography component="span">深さ：{hypocenter ? hypocenter.depth+' km' : '不明'}</Typography>
                    </Grid>
                    <Grid size={6} sx={{textAlign: "center"}}>
                        <Typography component="span">マグニチュード：{hypocenter ? hypocenter.magnitude : '不明'}</Typography>
                    </Grid>
                    <Grid size={6} sx={{textAlign: "center"}}>
                        <Typography component="span">緯度：{hypocenter ? '約 '+hypocenter.latitude+'°' : '不明'}</Typography>
                    </Grid>
                    <Grid size={6} sx={{textAlign: "center"}}>
                        <Typography component="span">経度：{hypocenter ? '約 '+hypocenter.longitude+'°' : '不明'}</Typography>
                    </Grid>
                </Grid>
            </CardContent>
        </DarkCard>
    )
}

export default HypocenterMobileContent
