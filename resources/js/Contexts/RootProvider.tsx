import { FC, ReactNode, useState } from "react";
import { AlertProps, RootContext } from "./RootContext";
import LoadingSystem from "@/Components/Systems/LoadingSystem";
import AlertSystem from "@/Components/Systems/AlertSystem";

type Props = {
    children: ReactNode
}

const RootProvider: FC<Props> = (props) => {
    const {children} = props

    const [REFRESH, SET_REFRESH] = useState(0)
    const [IS_LOAD, SET_IS_LOAD] = useState(false)
    const [ALERT, SET_ALERT] = useState<AlertProps>({open: false, status: 'info', message: '---'})

    window.addEventListener('beforeunload', () => SET_IS_LOAD(true))

    const values = {
        REFRESH,
        SET_REFRESH,
        IS_LOAD,
        SET_IS_LOAD,
        ALERT,
        SET_ALERT
    }

    return (
        <RootContext.Provider value={values}>
            {children}

            <AlertSystem />

            {IS_LOAD && (
                <LoadingSystem />
            )}
        </RootContext.Provider>
    )
}

export default RootProvider
