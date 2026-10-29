import { RootContext } from "@/Contexts/RootContext";
import { Place, Warning } from "@mui/icons-material";
import { alpha, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Typography } from "@mui/material";
import { FC, useContext } from "react";

const QuakeAlertSystem: FC = () => {
    const {QUAKE_ALERT, SET_QUAKE_ALERT} = useContext(RootContext)
    const onClose = () => SET_QUAKE_ALERT((prev) => ({...prev, open: false}))
    const place = QUAKE_ALERT.eew?.earthquake?.hypocenter?.name || "震源地不明"
    const prefs = Array.from(new Set(QUAKE_ALERT.eew?.points?.map((area) => area.pref) ?? []))
    const cancelFlg = QUAKE_ALERT.cancelFlg

    return (
        <Dialog
            open={QUAKE_ALERT.open}
            fullWidth
            hideBackdrop
            maxWidth="sm"
            sx={{
                "& .MuiDialog-container": {
                    alignItems: "flex-start"
                }
            }}
        >
            <DialogTitle sx={{
                backgroundColor: cancelFlg ? "#aaa" : "#f50",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                gap: 2
            }}>
                <Warning sx={{fontSize: "3rem"}} />
                <Box sx={{
                    display: "flex",
                    flexDirection: "column"
                }}>
                    {cancelFlg ? (
                        <>

                        </>
                    ) : (
                        <>
                            <Typography component="h5" sx={{fontSize: "1.5rem", fontWeight: "bold"}}>緊急地震速報【警報】</Typography>
                            <Typography variant="caption" sx={{fontSize: "1.1rem"}}>強い揺れに警戒してください</Typography>
                        </>
                    )}
                </Box>
            </DialogTitle>
            <Divider />
            <DialogContent sx={{
                backgroundColor: cancelFlg ? "#aaa" : "#f50",
                color: "#fff"
            }}>
                <Box sx={{
                    backgroundColor: alpha("#fff", 0.3),
                    borderRadius: 1,
                    p: 1
                }}>
                    <Typography component="h5" sx={{
                        fontWeight: "bold",
                        display: "flex"
                    }}>
                        <Place />
                        【震源地】{place}
                    </Typography>
                    <Divider sx={{borderColor: "#ddd", my: 1}} />
                    <Box sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 1
                    }}>
                        {prefs.map((pref, index) => (
                            <Button
                                variant="contained"
                                color="secondary"
                                sx={{pointerEvents: "none"}}
                                key={pref+index}
                            >
                                {pref}
                            </Button>
                        ))}
                    </Box>
                </Box>
            </DialogContent>
            <DialogActions onClick={onClose} sx={{
                backgroundColor: "#777",
                py: 0.5,
                fontWeight: "bold",
                color: "#fff",
                display: "flex",
                justifyContent: "center",
                cursor: "pointer"
            }}>
                確認
            </DialogActions>
        </Dialog>
    )
}

export default QuakeAlertSystem
