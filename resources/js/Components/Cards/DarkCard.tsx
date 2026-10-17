import { Card } from "@mui/material"
import { FC, ReactNode } from "react"

type Props = {
    children: ReactNode
    width?: number | string
    height?: number | string
    bgcolor?: string
    textColor?: string
}

const DarkCard: FC<Props> = (props) => {
    const {
        children,
        width = undefined,
        height = undefined,
        bgcolor = '#2e2e2e',
        textColor = '#fff',
    } = props

    return (
        <Card sx={{
            backgroundColor: bgcolor,
            color: textColor,
            position: 'relative',
            width,
            height
        }}>
            {children}
        </Card>
    )
}

export default DarkCard
