import { EEW, JmaQuake } from "@/types/p2pquake"
import { createContext, Dispatch, SetStateAction, useContext } from "react"

export type AlertProps = {
    open: boolean,
    status: 'success' | 'error' | 'warning' | 'info',
    message: string
}

export type QuakeAlertProps = {
    open: boolean
    eew: JmaQuake | null
    cancelFlg?: boolean
}

type Props = {
    REFRESH: number
    SET_REFRESH: Dispatch<SetStateAction<number>>
    IS_LOAD: boolean
    SET_IS_LOAD: Dispatch<SetStateAction<boolean>>
    ALERT: AlertProps
    SET_ALERT: Dispatch<SetStateAction<AlertProps>>
    QUAKE_ALERT: QuakeAlertProps
    SET_QUAKE_ALERT: Dispatch<SetStateAction<QuakeAlertProps>>
}

export const RootContext = createContext({} as Props)

export const useRootContext = () => useContext(RootContext)
