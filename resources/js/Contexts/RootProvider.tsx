import { FC, ReactNode, useState } from "react";
import { AlertProps, QuakeAlertProps, RootContext } from "./RootContext";
import LoadingSystem from "@/Components/Systems/LoadingSystem";
import AlertSystem from "@/Components/Systems/AlertSystem";
import QuakeAlertSystem from "@/Components/Systems/QuakeAlertSystem";

type Props = {
    children: ReactNode
}

const RootProvider: FC<Props> = (props) => {
    const {children} = props

    const [REFRESH, SET_REFRESH] = useState(0)
    const [IS_LOAD, SET_IS_LOAD] = useState(false)
    const [ALERT, SET_ALERT] = useState<AlertProps>({open: false, status: 'info', message: '---'})
    const [QUAKE_ALERT, SET_QUAKE_ALERT] = useState<QuakeAlertProps>({open: false, eew: null, cancelFlg: false})

    window.addEventListener('beforeunload', () => SET_IS_LOAD(true))

    const values = {
        REFRESH,
        SET_REFRESH,
        IS_LOAD,
        SET_IS_LOAD,
        ALERT,
        SET_ALERT,
        QUAKE_ALERT,
        SET_QUAKE_ALERT
    }

    return (
        <RootContext.Provider value={values}>
            {children}

            <AlertSystem />
            <QuakeAlertSystem />

            {IS_LOAD && (
                <LoadingSystem />
            )}
        </RootContext.Provider>
    )
}

export default RootProvider
