import { Card } from "@mui/material"
import { FC, ReactNode } from "react"

type Props = {
    children: ReactNode
    width?: number | string
    height?: number | string
    bgcolor?: string
    textColor?: string
    mt?: number
    mb?: number
}

const DarkCard: FC<Props> = (props) => {
    const {
        children,
        width = undefined,
        height = undefined,
        bgcolor = '#2e2e2e',
        textColor = '#fff',
        mt = 0,
        mb = 0
    } = props

    return (
        <Card sx={{
            backgroundColor: bgcolor,
            color: textColor,
            position: 'relative',
            width,
            height,
            mt,
            mb
        }}>
            {children}
        </Card>
    )
}

export default DarkCard
