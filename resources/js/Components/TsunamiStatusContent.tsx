import { FC } from "react";
import DarkCard from "./Cards/DarkCard";
import { alpha, Box, Card, CardContent, Divider, Stack, Typography } from "@mui/material";
import { Tsunami, Warning } from "@mui/icons-material";
import { JmaTsunami } from "@/types/p2pquake";
import useBousai from "@/Hooks/useBousai";

type Props = {
    tsunamiHistories: JmaTsunami | null
}

const TsunamiStatusContent: FC<Props> = ({tsunamiHistories}) => {
    const {getTsunamiGradeColor, formatTsunamiGrade} = useBousai()

    return (
        <DarkCard>
            <CardContent>
                <Stack spacing={2}>
                    <Typography component='h5' sx={{
                        borderBottom: '1px solid #aaa',
                        pb: 0.5,
                        alignItems: 'center',
                        display: 'flex'
                    }}>
                        <Tsunami sx={{mr: 1}} />
                        津波情報
                    </Typography>
                    {!tsunamiHistories && (
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1
                        }}>
                            <Warning />
                            <Typography component="span">津波に関する情報はありません</Typography>
                        </Box>
                    )}

                    {tsunamiHistories && tsunamiHistories.areas?.map((area, index) => {
                        const gradeColor: string = getTsunamiGradeColor(area.grade!)
                        const gradeValue: string = formatTsunamiGrade(area.grade!)

                        return (
                            <Card key={index} sx={{backgroundColor: '#333'}}>
                                <CardContent>
                                    <Stack spacing={1}>
                                        <Box sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 1
                                        }}>
                                            <Box sx={{
                                                backgroundColor: alpha(gradeColor, 0.3),
                                                border: '1px solid '+gradeColor,
                                                borderRadius: 2,
                                                fontWeight: 'bold',
                                                p: 0.5
                                            }}>
                                                {gradeValue}
                                            </Box>
                                            <Typography component="span">{area.name}</Typography>
                                        </Box>
                                        <Divider />
                                        <Box>
                                            <Typography component="p">高さ：最大{area.maxHeight?.description}</Typography>
                                            <Typography component="p" sx={{color: '#ff0'}}>
                                                {!area.firstHeight?.condition ? (
                                                    <>到達予想日時：{
                                                        new Date(area.firstHeight?.arrivalTime!).getHours()
                                                    }時 {
                                                        new Date(area.firstHeight?.arrivalTime!).getMinutes()
                                                    }分</>
                                                ) : (
                                                    <>{area.firstHeight.condition}</>
                                                )}
                                            </Typography>
                                        </Box>


                                    </Stack>
                                </CardContent>
                            </Card>
                        )
                    })}
                </Stack>
            </CardContent>
        </DarkCard>
    )
}

export default TsunamiStatusContent
