import useBousai from "@/Hooks/useBousai"
import { JmaQuake } from "@/types/p2pquake"
import {
    Box,
    Chip,
    List,
    ListItemButton,
    Stack,
    Typography,
    useTheme,
    alpha,
    CardContent
} from "@mui/material"
import { Dispatch, FC, SetStateAction, useState } from "react"
import DarkCard from "./Cards/DarkCard"

type Props = {
    p2pHistories: JmaQuake[]
    selectedHistory?: JmaQuake | null
    setSelectedHistory: Dispatch<SetStateAction<JmaQuake | null>>
}

const HistoriesContent: FC<Props> = ({
    p2pHistories,
    selectedHistory,
    setSelectedHistory
}) => {
    const theme = useTheme()
    const {formatScale, getScaleColor} = useBousai()
    const [internalSelectedId, setInternalSelectedId] = useState<string | null>(null)

    // 親から selectedHistory が渡されている場合はそちらのIDを優先
    const currentSelectedId = selectedHistory ? selectedHistory.id : internalSelectedId

    const handleSelect = (history: JmaQuake) => {
        setInternalSelectedId(history.id)
        setSelectedHistory(history)
    }

    return (
        <DarkCard>
            <CardContent>
                <Stack sx={{
                    mb: 1.5,
                    direction: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <Typography variant="h6" sx={{fontWeight: 'bold'}}>
                        地震履歴一覧
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        {p2pHistories.length} 件取得
                    </Typography>
                </Stack>

                <List
                    disablePadding
                    sx={{
                        maxHeight: '480px',
                        overflowY: 'auto',
                        pr: 0.5,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1,
                        '&::-webkit-scrollbar': { width: 6 },
                        '&::-webkit-scrollbar-thumb': {
                            backgroundColor: 'rgba(255,255,255,0.2)',
                            borderRadius: 3,
                        },
                    }}
                >
                    {p2pHistories.length === 0 ? (
                        <Box sx={{ py: 4, textAlign: 'center' }}>
                            <Typography color="text.secondary">地震情報を読み込み中、または履歴がありません</Typography>
                        </Box>
                    ) : (
                        p2pHistories.map((history) => {
                            const isSelected = currentSelectedId === history.id
                            const { earthquake } = history
                            const hypocenter = earthquake.hypocenter
                            const scaleColor = getScaleColor(earthquake.maxScale)

                            return (
                                <ListItemButton
                                    key={history.id}
                                    onClick={() => handleSelect(history)}
                                    sx={{
                                        p: 1.5,
                                        borderRadius: 1.5,
                                        border: '1px solid',
                                        borderColor: isSelected
                                            ? theme.palette.primary.main
                                            : 'rgba(255, 255, 255, 0.08)',
                                        borderLeft: isSelected
                                            ? `5px solid ${theme.palette.primary.main}`
                                            : '1px solid rgba(255, 255, 255, 0.08)',
                                        backgroundColor: isSelected
                                            ? alpha(theme.palette.primary.main, 0.16)
                                            : 'rgba(255, 255, 255, 0.02)',
                                        transition: 'all 0.2s ease-in-out',
                                        '&:hover': {
                                            backgroundColor: isSelected
                                                ? alpha(theme.palette.primary.main, 0.24)
                                                : 'rgba(255, 255, 255, 0.06)',
                                        },
                                    }}
                                >
                                    <Stack direction="row" spacing={1.5} sx={{ width: '100%', alignItems: 'center' }}>
                                        {/* 震度バッジ */}
                                        <Chip
                                            label={formatScale(earthquake.maxScale)}
                                            size="small"
                                            sx={{
                                                backgroundColor: scaleColor,
                                                color: '#ffffff',
                                                fontWeight: 'bold',
                                                minWidth: 70,
                                            }}
                                        />

                                        {/* 地震詳細 */}
                                        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                                            <Stack sx={{
                                                direction: 'row',
                                                justifyContent: 'space-between',
                                                alignItems: 'baseline'
                                            }}>
                                                <Typography
                                                    variant="subtitle2"
                                                    noWrap
                                                    sx={{ color: isSelected ? theme.palette.primary.light : 'text.primary', fontWeight: 'bold' }}
                                                >
                                                    {hypocenter?.name || '震源情報なし'}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    {earthquake.time}
                                                </Typography>
                                            </Stack>

                                            <Stack direction="row" spacing={1.5} sx={{ mt: 0.5 }}>
                                                <Typography variant="caption" color="text.secondary">
                                                    規模: {hypocenter?.magnitude !== -1 && hypocenter?.magnitude !== undefined ? `M${hypocenter.magnitude.toFixed(1)}` : '不明'}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    深さ: {hypocenter?.depth === 0 ? 'ごく浅い' : hypocenter?.depth && hypocenter.depth > 0 ? `${hypocenter.depth}km` : '不明'}
                                                </Typography>
                                            </Stack>
                                        </Box>
                                    </Stack>
                                </ListItemButton>
                            )
                        })
                    )}
                </List>
            </CardContent>
        </DarkCard>
    )
}

export default HistoriesContent
