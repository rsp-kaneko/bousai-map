import useP2PquakeApi from "@/api/useP2PquakeApi";
import BousaiStatusContent from "@/Components/BousaiStatusContent";
import HistoriesContent from "@/Components/HistoriesContent";
import PrefecturesMap from "@/Components/Maps/PrefecturesMap";
import TsunamiStatusContent from "@/Components/TsunamiStatusContent";
import RootLayout from "@/Layouts/RootLayout";
import { JmaQuake } from "@/types/p2pquake";
import { Grid, Stack } from "@mui/material";
import { FC, useEffect, useState } from "react";

const Top: FC = () => {
    const {p2pHistories, tsunamiHistories, getP2pHistories, getTsunamiHistories} = useP2PquakeApi()

    const [selectedHistory, setSelectedHistory] = useState<JmaQuake | null>(null)
    useEffect(() => {
        getP2pHistories(30)
    }, [])

    useEffect(() => {
        setSelectedHistory(p2pHistories[0])
    }, [p2pHistories])

    useEffect(() => {
        selectedHistory && getTsunamiHistories(selectedHistory.id)
    }, [selectedHistory])

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
                        />
                    </Grid>
                </Grid>
                <Grid container spacing={2} sx={{px: 2}}>
                    <Grid size={{xs: 12, lg: 6}}>
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
