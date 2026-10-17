import { createContext, Dispatch, SetStateAction, useContext } from "react"

export type AlertProps = {
    open: boolean,
    status: 'success' | 'error' | 'warning' | 'info',
    message: string
}

type Props = {
    REFRESH: number
    SET_REFRESH: Dispatch<SetStateAction<number>>
    IS_LOAD: boolean
    SET_IS_LOAD: Dispatch<SetStateAction<boolean>>
    ALERT: AlertProps
    SET_ALERT: Dispatch<SetStateAction<AlertProps>>
}

export const RootContext = createContext({} as Props)

export const useRootContext = () => useContext(RootContext)
