import { alpha, Card } from "@mui/material"
import { FC, ReactNode } from "react"

type Props = {
    children: ReactNode
    width?: number | string
    height?: number | string
    bgcolor?: string
    textColor?: string
}

const OutlinedCard: FC<Props> = ({
    children,
    width = undefined,
    height = undefined,
    bgcolor = '#fff',
    textColor = '#333'
}) => {

    return (
        <Card sx={{
            width: width,
            height: height,
            border: '2.5px solid '+bgcolor,
            backgroundColor: alpha(bgcolor, 0.2),
            color: textColor,
            boxSizing: 'border-box'
        }}>
            {children}
        </Card>
    )
}

export default OutlinedCard
