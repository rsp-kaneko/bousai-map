import RootFooter from "@/Components/Footers/RootFooter";
import RootHeader from "@/Components/Headers/RootHeader";
import { Head } from "@inertiajs/react";
import { Container } from "@mui/material";
import { FC, ReactNode } from "react";

type Props = {
    children: ReactNode
    pageTitle: string
}

const RootLayout: FC<Props> = (props) => {
    const {children, pageTitle} = props

    return (
        <>
            <Head title={pageTitle} />

            <RootHeader />
            <main>{children}</main>
            <RootFooter />
        </>
    )
}

export default RootLayout
