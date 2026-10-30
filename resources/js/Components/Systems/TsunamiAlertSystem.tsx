import { RootContext } from "@/Contexts/RootContext";
import { JmaTsunamiArea } from "@/types/p2pquake";
import { Place, Tsunami, Warning } from "@mui/icons-material";
import { alpha, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Typography } from "@mui/material";
import { FC, useContext } from "react";

const TsunamiAlertSystem: FC = () => {
    const {TSUNAMI_ALERT, SET_TSUNAMI_ALERT} = useContext(RootContext)
    const onClose = () => SET_TSUNAMI_ALERT((prev) => ({...prev, open: false}))
    const areas: JmaTsunamiArea[] | undefined = TSUNAMI_ALERT.tsunami?.areas
    const cancelFlg = TSUNAMI_ALERT.cancelFlg

    return (
        <Dialog
            open={TSUNAMI_ALERT.open}
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
                backgroundColor: cancelFlg ? "#555" : "#aa0",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                gap: 2
            }}>
                <Tsunami sx={{fontSize: "3rem"}} />
                <Box sx={{
                    display: "flex",
                    flexDirection: "column"
                }}>
                    {cancelFlg ? (
                        <>
                            <Typography component="h5" sx={{fontSize: "1.5rem", fontWeight: "bold"}}>津波警報は解除されました</Typography>
                            <Typography variant="caption" sx={{fontSize: "1.1rem"}}>津波情報は取り消されました</Typography>
                        </>
                    ) : (
                        <>
                            <Typography component="h5" sx={{fontSize: "1.5rem", fontWeight: "bold"}}>津波予報【警報】</Typography>
                            <Typography variant="caption" sx={{fontSize: "1.1rem"}}>最新の津波情報を受信しました</Typography>
                        </>
                    )}
                </Box>
            </DialogTitle>
            <Divider />
            <DialogContent sx={{
                backgroundColor: cancelFlg ? "#555" : "#aa0",
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
                        {cancelFlg ? (
                            <>以下の警報は解除されました</>
                        ) : (
                            <>対象地域は以下の通りです</>
                        )}
                    </Typography>
                    <Divider sx={{borderColor: "#ddd", my: 1}} />
                    <Box sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 1
                    }}>
                        {areas && areas.map((area, index) => (
                            <Button
                                variant="contained"
                                color={cancelFlg ? "primary" : "error"}
                                sx={{pointerEvents: "none"}}
                                key={area.name+index}
                            >
                                {!cancelFlg && (
                                    <>【{["MajorWarning","Warning"].includes(area.grade!) && (<Warning />)} {area.grade} </>
                                )}
                                {area.name}
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
                確認（閉じる）
            </DialogActions>
        </Dialog>
    )
}

export default TsunamiAlertSystem
