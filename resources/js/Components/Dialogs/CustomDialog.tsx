import { Cancel } from "@mui/icons-material"
import { Box, Dialog, DialogContent, DialogTitle, Divider, IconButton, Typography } from "@mui/material"
import { FC, ReactNode } from "react"

type Props = {
    open: boolean
    onClose: () => void
    title: string | ReactNode
    subTitle?: string | ReactNode
    icon: ReactNode
    color?: string
    children: ReactNode
}

const CustomDialog: FC<Props> = ({
    open,
    onClose,
    title,
    subTitle = undefined,
    icon,
    color = undefined,
    children
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
                        width: 40,
                        height: 40,
                        backgroundColor: "#333",
                        borderRadius: "50%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        color: color
                    }}>
                        {icon}
                    </Box>
                    <Box sx={{
                        display: "flex",
                        flexDirection: "column"
                    }}>
                        <Typography component="h5" sx={{fontSize: "1.25rem"}}>{title}</Typography>
                        <Typography variant="caption" sx={{color: color ? color: "#aaa"}}>{subTitle}</Typography>
                    </Box>
                </Box>
                <IconButton onClick={onClose}>
                    <Cancel fontSize="medium" />
                </IconButton>
            </DialogTitle>
            <Divider />
            <DialogContent>
                {children}
            </DialogContent>
        </Dialog>
    )
}

export default CustomDialog
