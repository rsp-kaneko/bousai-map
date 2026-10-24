import { JmaQuake } from "@/types/p2pquake"
import { Cancel } from "@mui/icons-material"
import { Box, Dialog, DialogContent, DialogTitle, IconButton, Typography } from "@mui/material"
import { Dispatch, FC, SetStateAction } from "react"

type Props = {
    open: boolean
    onClose: () => void
    p2pHistories: JmaQuake[]
    selectedHistory?: JmaQuake | null
    setSelectedHistory: Dispatch<SetStateAction<JmaQuake | null>>
}

const MobileHistoryDialog: FC<Props> = ({
    open,
    onClose,
    p2pHistories,
    selectedHistory,
    setSelectedHistory
}) => {

    return (
        <Dialog open={open} fullWidth>
            <DialogTitle sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
            }}>
                <Box sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1
                }}>
                    <Box sx={{
                        width: 64,
                        height: 64,
                        backgroundColor: "#333",
                        borderRadius: "50%"
                    }}>

                    </Box>
                    <Box>
                        <Typography component="h5" sx={{fontSize: "1.25rem"}}>Title</Typography>
                        <Typography variant="caption">TestDialog</Typography>
                    </Box>
                </Box>
                <IconButton onClick={onClose}>
                    <Cancel fontSize="large" />
                </IconButton>
            </DialogTitle>
            <DialogContent>

            </DialogContent>
        </Dialog>
    )
}

export default MobileHistoryDialog
