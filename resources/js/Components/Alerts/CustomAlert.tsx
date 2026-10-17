import { InfoOutlineRounded } from "@mui/icons-material"
import { Alert, alpha } from "@mui/material"
import { FC } from "react"

type Props = {
    color: string
    message: string
}

const CustomAlert: FC<Props> = ({ color, message }) => {

    return (
        <Alert
            variant="outlined"
            icon={<InfoOutlineRounded sx={{ color: color }} />}
            sx={{
                mt: 1,
                borderColor: color,
                color: '#fff',
                backgroundColor: alpha(color, 0.15),
                fontWeight: 'bold',
                '& .MuiAlert-icon': {
                    color: color,
                },
            }}
        >
            {message}
        </Alert>
    )
}

export default CustomAlert
