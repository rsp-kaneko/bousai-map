import { useRootContext } from "@/Contexts/RootContext";
import { usePage } from "@inertiajs/react";
import { Logout } from "@mui/icons-material";
import { Box, Button, Typography } from "@mui/material";
import axios from "axios";
import { FC } from "react";

const RootHeader: FC = () => {
    const {SET_IS_LOAD} = useRootContext()
    const isAuth = usePage().props.auth.user && usePage().props.auth.user.role_id == 1

    const handleLogout = () => {
        SET_IS_LOAD(true)
        axios.post(route('logout'), {}).then(() => location.reload())
    }

    return (
        <header>
            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                height: 80,
                width: '100%',
                backgroundColor: '#2e2e2e',
                px: {xs: 3, md: 5}
            }}>
                <Typography component='span' sx={{fontWeight: 'bold', fontSize: '1.2rem'}}>
                    地震情報防災アプリ
                </Typography>
                {isAuth && (
                    <Button onClick={handleLogout} startIcon={<Logout />}>ログアウト</Button>
                )}
            </Box>
        </header>
    )
}

export default RootHeader
