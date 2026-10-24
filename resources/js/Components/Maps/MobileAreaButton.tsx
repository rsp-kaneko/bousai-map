import { JmaQuake, JmaTsunami } from "@/types/p2pquake"
import { ManageSearch, Place, Tsunami } from "@mui/icons-material"
import { Badge, Box, IconButton, Stack } from "@mui/material"
import { Dispatch, FC, SetStateAction, useState } from "react"
import MobileHistoryDialog from "./MobileHistoryDialog"

type Props = {
    selectedHistory: JmaQuake | null
    setSelectedHistory: Dispatch<SetStateAction<JmaQuake | null>>
    p2pHistories: JmaQuake[]
    tsunamiHistories: JmaTsunami | null
}

const MobileAreaButton: FC<Props> = ({
    selectedHistory,
    setSelectedHistory,
    p2pHistories,
    tsunamiHistories
}) => {
    const [openHistoryDialog, setOpenHistoryDialog] = useState(false)

    return (
        <Box sx={{
            position: "absolute",
            top: 64,
            right: 30,
            zIndex: 1000,
            display: {xs: "block", md: "none"}
        }}>
            <Stack spacing={3}>
                <Badge
                    badgeContent={selectedHistory?.points?.length}
                    color="error"
                    max={999}
                >
                    <IconButton sx={{
                        backgroundColor: "#333",
                        border: "3px solid #fa0"
                    }}>
                        <Place fontSize="large" />
                    </IconButton>
                </Badge>
                <Badge
                    badgeContent={tsunamiHistories?.areas?.length}
                    color="error"
                >
                    <IconButton sx={{
                        backgroundColor: "#333",
                        border: "3px solid #0af"
                    }}>
                        <Tsunami fontSize="large" />
                    </IconButton>
                </Badge>
                <IconButton
                    onClick={() => setOpenHistoryDialog(true)}
                    sx={{
                        backgroundColor: "#333",
                        border: "3px solid #0f0"
                    }}
                >
                    <ManageSearch fontSize="large" />
                </IconButton>
            </Stack>

            <MobileHistoryDialog
                open={openHistoryDialog}
                onClose={() => setOpenHistoryDialog(false)}
                selectedHistory={selectedHistory}
                setSelectedHistory={setSelectedHistory}
                p2pHistories={p2pHistories}
            />
        </Box>
    )
}

export default MobileAreaButton
