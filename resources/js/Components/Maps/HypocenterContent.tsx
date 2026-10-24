import useBousai from "@/Hooks/useBousai"
import { JmaHypocenter, JmaScale } from "@/types/p2pquake"
import { alpha, Box, Grid, Typography } from "@mui/material"
import { FC } from "react"

type Props = {
    hypocenter: JmaHypocenter | null
    maxScale: JmaScale
}

const HypocenterContent: FC<Props> = ({hypocenter, maxScale}) => {
    const {getScaleColor} = useBousai()

    const fontStyle = {fontSize: {xs: '0.8rem', md: '1rem'}}

    return (
        <Box sx={{
            position: 'absolute',
            zIndex: 500,
            width: {xs: '100%', md: 400},
            p: 1,
            top: {xs: 0, md: 10},
            right: {xs: 0, md: 10},
            backgroundColor: alpha(getScaleColor(maxScale), 0.7),
            border: '2px solid #aaa',
            display: {xs: "none", md: "block"}
        }}>
            <Grid container spacing={{xs: 0, md: 2}}>
                <Grid size={6}>
                    <Typography component="span" sx={fontStyle}>深さ：{hypocenter ? hypocenter.depth+' km' : '不明'}</Typography>
                </Grid>
                <Grid size={6}>
                    <Typography component="span" sx={fontStyle}>マグニチュード：{hypocenter ? hypocenter.magnitude : '不明'}</Typography>
                </Grid>
                <Grid size={6}>
                    <Typography component="span" sx={fontStyle}>緯度：{hypocenter ? '約 '+hypocenter.latitude+'°' : '不明'}</Typography>
                </Grid>
                <Grid size={6}>
                    <Typography component="span" sx={fontStyle}>経度：{hypocenter ? '約 '+hypocenter.longitude+'°' : '不明'}</Typography>
                </Grid>
            </Grid>
        </Box>
    )
}

export default HypocenterContent
