import { Box } from "@mui/material";
import { FC } from "react";

const RootFooter: FC = () => {
    return (
        <footer>
            <Box sx={{
                display: "flex",
                justifyContent: 'center',
                alignItems: 'center',
                py: {xs: 1, md: 8}
            }}>
                &copy; supported by kaneko
            </Box>
        </footer>
    )
}

export default RootFooter
