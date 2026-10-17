import { Box, CircularProgress, LinearProgress, Typography } from "@mui/material";
import { FC } from "react";

const MapLoadingViewer: FC = () => {
    return (
        <>
            <LinearProgress
                color="warning"
                sx={{
                    position: 'absolute',
                    top: 0,
                    zIndex: 1001,
                    width: '100%'
                }}
            />
            <Box sx={{
                position: 'absolute',
                zIndex: 1000,
                inset: 0,
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(100, 100, 100, 0.7)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <Box sx={{
                    width: 200,
                    height: 64,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    borderRadius: 4,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: 1
                }}>
                    <Typography component="p">Map Loading...</Typography>
                    <CircularProgress color="warning" />
                </Box>
            </Box>
        </>
    )
}

export default MapLoadingViewer
