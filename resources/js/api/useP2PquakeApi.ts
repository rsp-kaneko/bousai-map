import { useRootContext } from "@/Contexts/RootContext"
import { JmaQuake, JmaTsunami } from "@/types/p2pquake"
import axios from "axios"
import { useCallback, useState } from "react"

const useP2PquakeApi = () => {
    const P2P_QUAKE_URL = "https://api.p2pquake.net/v2"
    const {SET_ALERT} = useRootContext()
    const [p2pHistories, setP2pHistories] = useState<JmaQuake[]>([])
    const [tsunamiHistories, setTsunamiHistories] = useState<JmaTsunami | null>(null)

    const getP2pHistories = useCallback((limit: number) => {
        axios.get(`${P2P_QUAKE_URL}/history?codes=551&limit=${limit}`,
            {headers: {
                'X-Requested-With': undefined,
            }},
        )
            .then((res) => {
                setP2pHistories(res.data)
            })
            .catch((error) => {
                SET_ALERT({open: true, status: 'error', message: '地震情報の取得に失敗しました'})
                console.error(error)
            })
    }, [])

    const getTsunamiHistories = useCallback((id: string) => {
        axios.get(`${P2P_QUAKE_URL}/jma/tsunami/${id}`,
            {headers: {
                'X-Requested-With': undefined,
            }},
        )
            .then((res) => {
                setTsunamiHistories(res.data)
            })
            .catch((error) => {
                if (axios.isAxiosError(error) && error.response?.status === 404) {
                    setTsunamiHistories(null)
                } else {
                    SET_ALERT({open: true, status: 'error', message: '津波情報の取得に失敗しました'})
                    console.error(error)
                }
            })

    }, [])

    return {
        p2pHistories,
        tsunamiHistories,
        getP2pHistories,
        getTsunamiHistories
    }
}

export default useP2PquakeApi
