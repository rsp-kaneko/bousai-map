import usePointLayer from "@/Hooks/usePointLayer"
import { Box, Dialog, DialogContent } from "@mui/material"
import { FC, useEffect } from "react"
import SheltersMap from "./Maps/SheltersMap"

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
        <Dialog open={status.open} onClose={onReset} maxWidth="lg">
            <DialogContent>
                <Box sx={{width: '1000px'}}>
                    {shelters.length !== 0 && (
                        <SheltersMap
                            shelters={shelters}
                        />
                    )}
                </Box>
            </DialogContent>
        </Dialog>
    )
}

export default SheltersMapDialog
