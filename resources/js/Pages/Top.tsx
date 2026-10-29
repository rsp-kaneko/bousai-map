import useP2PquakeApi from "@/api/useP2PquakeApi";
import BousaiStatusContent from "@/Components/BousaiStatusContent";
import HistoriesContent from "@/Components/HistoriesContent";
import PrefecturesMap from "@/Components/Maps/PrefecturesMap";
import TsunamiStatusContent from "@/Components/TsunamiStatusContent";
import { RootContext } from "@/Contexts/RootContext";
import RootLayout from "@/Layouts/RootLayout";
import { JmaQuake } from "@/types/p2pquake";
import { Wifi, WifiOff } from "@mui/icons-material";
import { Button, Chip, Grid, Stack, Tooltip } from "@mui/material";
import { FC, useContext, useEffect, useState } from "react";

const Top: FC = () => {
    // 環境変数 VITE_USE_P2P_SANDBOX が 'true' の場合はテスト用サンドボックスを使用
    const useSandbox = import.meta.env.VITE_USE_P2P_SANDBOX === 'true';
    const { p2pHistories, tsunamiHistories, getP2pHistories, getTsunamiHistories, wsStatus } = useP2PquakeApi({
        useSandbox
    });

    const [selectedHistory, setSelectedHistory] = useState<JmaQuake | null>(null);
    const {SET_QUAKE_ALERT} = useContext(RootContext)
    const handleTest = () => SET_QUAKE_ALERT({open: true, eew: selectedHistory})

    useEffect(() => {
        getP2pHistories(30);
    }, []);

    useEffect(() => {
        setSelectedHistory(p2pHistories[0]);
    }, [p2pHistories]);

    useEffect(() => {
        selectedHistory && getTsunamiHistories(selectedHistory.id);
    }, [selectedHistory]);

    // WebSocketステータスバッジの描画
    const renderWsStatusBadge = () => {
        if (wsStatus === 'OPEN') {
            return (
                <Tooltip title={useSandbox ? "P2P地震情報 サンドボックス環境に接続中（約30秒ごとにテストデータ配信）" : "P2P地震情報 WebSocket APIに接続中（リアルタイム受信）"}>
                    <Chip
                        icon={<Wifi fontSize="small" sx={{ "&&": { color: "#4caf50" } }} />}
                        label={useSandbox ? "リアルタイム受信中 [テストモード]" : "リアルタイム受信中 (Live)"}
                        size="small"
                        sx={{
                            backgroundColor: "rgba(76, 175, 80, 0.15)",
                            color: "#81c784",
                            borderColor: "#4caf50",
                            borderWidth: 1,
                            borderStyle: "solid",
                            fontWeight: "bold",
                            fontSize: "0.75rem",
                        }}
                    />
                </Tooltip>
            );
        }

        if (wsStatus === 'CONNECTING') {
            return (
                <Chip
                    icon={<Wifi fontSize="small" sx={{ "&&": { color: "#ff9800" } }} />}
                    label="WebSocket 接続中..."
                    size="small"
                    sx={{
                        backgroundColor: "rgba(255, 152, 0, 0.15)",
                        color: "#ffb74d",
                        borderColor: "#ff9800",
                        borderWidth: 1,
                        borderStyle: "solid",
                        fontSize: "0.75rem",
                    }}
                />
            );
        }

        return (
            <Tooltip title="WebSocket未接続または再接続待機中">
                <Chip
                    icon={<WifiOff fontSize="small" sx={{ "&&": { color: "#9e9e9e" } }} />}
                    label="オフライン (切断中)"
                    size="small"
                    sx={{
                        backgroundColor: "rgba(158, 158, 158, 0.15)",
                        color: "#9e9e9e",
                        borderColor: "#757575",
                        borderWidth: 1,
                        borderStyle: "solid",
                        fontSize: "0.75rem",
                    }}
                />
            </Tooltip>
        );
    };

    return (
        <RootLayout pageTitle="TOP">
            <Stack spacing={3}>
                <Grid container>
                    <Grid size={{xs: 12, md: 7}}>
                        <PrefecturesMap
                            selectedHistory={selectedHistory}
                            setSelectedHistory={setSelectedHistory}
                            p2pHistories={p2pHistories}
                            tsunamiHistories={tsunamiHistories}
                        />
                    </Grid>
                    <Grid size={{xs: 12, md: 5}} sx={{p: 2}}>
                        <BousaiStatusContent
                            selectedHistory={selectedHistory}
                            renderWsStatusBadge={renderWsStatusBadge}
                        />
                    </Grid>
                </Grid>
                <Grid container spacing={2} sx={{px: 2, display: {xs: "none", md: "flex"}}}>
                    <Grid size={{xs: 12, lg: 6}}>
                        <Button onClick={handleTest}>test</Button>
                        <HistoriesContent
                            p2pHistories={p2pHistories}
                            selectedHistory={selectedHistory}
                            setSelectedHistory={setSelectedHistory}
                        />
                    </Grid>
                    <Grid size={{xs: 12, lg: 6}}>
                        <TsunamiStatusContent
                            tsunamiHistories={tsunamiHistories}
                        />
                    </Grid>
                </Grid>
            </Stack>
        </RootLayout>
    );
};

export default Top;
