import { Box, CardContent, CardHeader, CircularProgress, LinearProgress, Typography } from "@mui/material";
import { FC } from "react";
import DarkCard from "../Cards/DarkCard";

const LoadingSystem: FC = () => {
    return (
        <Box sx={{
            position: 'fixed',
            inset: 0,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 10000
        }}>
            <DarkCard width={200} height={200}>
                <CardContent sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: 2,
                    height: '100%'
                }}>
                    <LinearProgress sx={{width: '100%', position: 'absolute', top: 0}}/>
                    <CircularProgress size={64} />
                    <Typography component='p'>Loading Now...</Typography>
                </CardContent>
            </DarkCard>
        </Box>
    )
}

export default LoadingSystem
