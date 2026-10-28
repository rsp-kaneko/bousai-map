import usePointLayer from "@/Hooks/usePointLayer"
import { Box, CircularProgress, Dialog, DialogContent, Typography } from "@mui/material"
import { FC, useEffect } from "react"
import SheltersMap from "./Maps/SheltersMap"
import { Campaign, Help } from "@mui/icons-material"
import CustomDialog from "./Dialogs/CustomDialog"

type Props = {
    status: {open: boolean, prefectureName: string, localName: string}
    onReset: () => void
}

const SheltersMapDialog: FC<Props> = ({
    status,
    onReset
}) => {
    const {isLoad, shelters, getShelters} = usePointLayer()

    useEffect(() => {
        if (status.open) {
            getShelters({
                prefectureName: status.prefectureName,
                localName: status.localName
            })
        }
    }, [status])

    return (
        <CustomDialog
            open={status.open}
            onClose={onReset}
            maxWidth="xl"
            title={status.localName+" - 避難所"}
            subTitle="指定避難所・指定緊急避難場所"
            icon={<Campaign />}
        >
            <DialogContent sx={{p: 0}}>
                <Box>
                    {isLoad && (
                        <Box sx={{
                            width: "100%",
                            height: 500,
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                            gap: 1
                        }}>
                            <CircularProgress size="5rem" />
                            <Typography component="span">避難場所読み込み中...</Typography>
                        </Box>
                    )}
                    {!isLoad && shelters.length === 0 && (
                        <Box sx={{
                            width: "100%",
                            height: 500,
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                            gap: 1
                        }}>
                            <Help sx={{fontSize: "5rem"}} />
                            <Typography component="span">避難場所が見つかりませんでした</Typography>
                        </Box>
                    )}
                    {!isLoad && shelters.length !== 0 && (
                        <SheltersMap
                            shelters={shelters}
                        />
                    )}
                </Box>
            </DialogContent>
        </CustomDialog>
    )
}

export default SheltersMapDialog
