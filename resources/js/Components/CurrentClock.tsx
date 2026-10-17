import { Box, Typography } from "@mui/material"
import { FC, useEffect, useState } from "react"

type Props = {
    actionDateTime: string | undefined
}

// 1秒ごとに更新される時計部分を独立コンポーネント化
const CurrentClock: FC<Props> = ({actionDateTime}) => {
    const [currentDate, setCurrentDate] = useState('')
    const [currentTime, setCurrentTime] = useState('')

    useEffect(() => {
        const year = new Date(actionDateTime!).getFullYear()
        const month = new Date(actionDateTime!).getMonth() + 1
        const date = new Date(actionDateTime!).getDate()
        const dayValues = ['日', '月', '火', '水', '木', '金', '土']
        const day = dayValues[new Date(actionDateTime!).getDay()]
        const hour = new Date(actionDateTime!).getHours()
        const min = new Date(actionDateTime!).getMinutes()
        const sec = new Date(actionDateTime!).getSeconds()
        setCurrentDate(year+'年 '+month+'月 '+date+'日 ('+day+')')
        setCurrentTime(hour+'時 '+min+'分 '+sec+'秒')
    }, [actionDateTime])

    return (
        <Box>
            <Typography component='h1' sx={{fontSize: {xs: '1.3rem', md: '1.6rem'}, color: '#adf'}}>{currentDate}</Typography>
            <Typography component='h1' sx={{fontSize: {xs: '1rem', md: '1.3rem'}}}>{currentTime}</Typography>
        </Box>
    )
}

export default CurrentClock
