import { useRootContext } from "@/Contexts/RootContext";
import { Alert, Snackbar, SnackbarCloseReason } from "@mui/material"
import { FC, SyntheticEvent } from "react"

const AlertSystem: FC = () => {
    const {ALERT, SET_ALERT} = useRootContext()
    const handleClose = (
        event?: Event | SyntheticEvent<any, Event> | null,
        reason?: SnackbarCloseReason,
    ) => {
        if (reason === 'clickaway') {
            return;
        }

        SET_ALERT((prev) => ({...prev, open: false}));
    };

    return (
        <Snackbar
            open={ALERT.open}
            autoHideDuration={3000}
            onClose={handleClose}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
            <Alert
                onClose={handleClose}
                severity={ALERT.status}
                variant='filled'
                sx={{width: '100%'}}
            >
                {ALERT.message}
            </Alert>
        </Snackbar>
    )
}

export default AlertSystem
