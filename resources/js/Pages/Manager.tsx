import DarkCard from "@/Components/Cards/DarkCard";
import RootLayout from "@/Layouts/RootLayout";
import FileDropZone from "@/Components/Forms/FileDropZone";
import { CardContent, Container, Stack } from "@mui/material";
import { FC } from "react";

const Manager: FC = () => {
    return (
        <RootLayout pageTitle="管理ページ">
            <Container sx={{ mt: 3, mb: 5 }}>
                <Stack spacing={3}>
                    <DarkCard>
                        <CardContent sx={{ p: 3 }}>
                            <FileDropZone
                                dataType='prefecture'
                                title="都道府県ポリゴン GeoJSONデータ"
                                description="47都道府県ポリゴンの GeoJSON (.geojson, .json) ファイルをドラッグ＆ドロップまたは選択してください"
                            />
                        </CardContent>
                    </DarkCard>
                    <DarkCard>
                        <CardContent sx={{ p: 3 }}>
                            <FileDropZone
                                dataType='coastLines'
                                title="海岸線ライン GeoJSONデータ"
                                description="海岸線ラインの GeoJSON (.geojson, .json) ファイルをドラッグ＆ドロップまたは選択してください"
                            />
                        </CardContent>
                    </DarkCard>
                    <DarkCard>
                        <CardContent sx={{ p: 3 }}>
                            <FileDropZone
                                dataType='point'
                                title="指定避難所・指定緊急避難場所 GeoJSONデータ"
                                description="指定避難所・指定緊急避難場所の GeoJSON (.geojson, .json) ファイルをドラッグ＆ドロップまたは選択してください"
                            />
                        </CardContent>
                    </DarkCard>
                </Stack>
            </Container>
        </RootLayout>
    );
};

export default Manager
