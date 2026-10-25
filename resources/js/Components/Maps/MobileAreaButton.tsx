import { JmaObservationPoint, JmaQuake, JmaScale, JmaTsunami } from "@/types/p2pquake"
import { ManageSearch, Place, Tsunami } from "@mui/icons-material"
import { Badge, Box, IconButton, Stack } from "@mui/material"
import { Dispatch, FC, SetStateAction, useEffect, useMemo, useState } from "react"
import MobileHistoryDialog from "./MobileHistoryDialog"
import MobileTsunamiDialog from "./MobileTsunamiDialog"
import MobileAreaStatusDialog from "./MobileAreaStatusDialog"

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
    const [openAreaStatusDialog, setOpenAreaStatusDialog] = useState(false)
    const [openTsunamiDialog, setOpenTsunamiDialog] = useState(false)
    const [openHistoryDialog, setOpenHistoryDialog] = useState(false)

    const [selectedPref, setSelectedPref] = useState<{pref: string, scale: JmaScale} | null>(null)
    const points: JmaObservationPoint[] = selectedHistory?.points ?? []
        const pointPrefs: Array<{pref: string, scale: JmaScale}> = useMemo(() => {
            const prefs: Array<{pref: string, scale: JmaScale}> = []
            points.forEach((point) => {
                const isPref = prefs.find((data) => data.pref === point.pref) != null
                if (!isPref) prefs.push({pref: point.pref, scale: point.scale})
            })
            return prefs
        }, [points])

        useEffect(() => {
            if (pointPrefs.length > 0) {
                setSelectedPref(pointPrefs[0])
            } else {
                setSelectedPref(null)
            }
        }, [pointPrefs])

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
                    <IconButton
                        onClick={() => setOpenAreaStatusDialog(true)}
                        sx={{
                            backgroundColor: "#333",
                            border: "3px solid #fa0"
                        }}
                    >
                        <Place fontSize="large" />
                    </IconButton>
                </Badge>
                <Badge
                    badgeContent={tsunamiHistories?.areas?.length}
                    color="error"
                >
                    <IconButton
                        onClick={() => setOpenTsunamiDialog(true)}
                        sx={{
                            backgroundColor: "#333",
                            border: "3px solid #0af"
                        }}
                    >
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

            <MobileAreaStatusDialog
                open={openAreaStatusDialog}
                onClose={() => setOpenAreaStatusDialog(false)}
                points={points}
                pointPrefs={pointPrefs}
                selectedPref={selectedPref}
                setSelectedPref={setSelectedPref}
            />

            <MobileTsunamiDialog
                open={openTsunamiDialog}
                onClose={() => setOpenTsunamiDialog(false)}
                tsunamiHistories={tsunamiHistories}
            />

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
