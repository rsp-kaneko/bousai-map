import { useRootContext } from "@/Contexts/RootContext"
import { JmaQuake, JmaTsunami, P2pHistoryItem } from "@/types/p2pquake"
import axios from "axios"
import { useCallback, useEffect, useRef, useState } from "react"

export type WebSocketStatus = 'CONNECTING' | 'OPEN' | 'CLOSING' | 'CLOSED';

export interface UseP2PquakeApiOptions {
    autoConnect?: boolean; // 自動でWebSocketに接続するか（デフォルト: true）
    useSandbox?: boolean;  // テスト用サンドボックス環境を使用するか（デフォルト: false）
}

const useP2PquakeApi = (options: UseP2PquakeApiOptions = {}) => {
    const { autoConnect = true, useSandbox = false } = options;
    const P2P_QUAKE_URL = "https://api.p2pquake.net/v2"
    const P2P_QUAKE_WS_URL = useSandbox
        ? "wss://api-realtime-sandbox.p2pquake.net/v2/ws"
        : "wss://api.p2pquake.net/v2/ws";

    const { SET_ALERT } = useRootContext()
    const [p2pHistories, setP2pHistories] = useState<JmaQuake[]>([])
    const [tsunamiHistories, setTsunamiHistories] = useState<JmaTsunami | null>(null)
    const [wsStatus, setWsStatus] = useState<WebSocketStatus>('CLOSED')

    const wsRef = useRef<WebSocket | null>(null)
    const reconnectTimerRef = useRef<NodeJS.Timeout | null>(null)
    const isUnmountingRef = useRef<boolean>(false)

    // REST API: 過去の地震情報履歴を取得
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
                // SET_ALERT({open: true, status: 'error', message: '地震情報の取得に失敗しました'})
                console.error(error)
            })
    }, [SET_ALERT])

    // REST API: 津波情報の履歴を取得
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
                    // SET_ALERT({open: true, status: 'error', message: '津波情報の取得に失敗しました'})
                    console.error(error)
                }
            })
    }, [SET_ALERT])

    // WebSocketメッセージ受信ハンドラ
    const handleWebSocketMessage = useCallback((event: MessageEvent) => {
        try {
            const data: P2pHistoryItem = JSON.parse(event.data)
            if (!data || !data.code) return

            // 551: 地震情報
            if (data.code === 551) {
                const quake = data as JmaQuake
                setP2pHistories((prev) => {
                    const existingIndex = prev.findIndex((item) => item.id === quake.id)
                    if (existingIndex !== -1) {
                        const updated = [...prev]
                        updated[existingIndex] = quake
                        return updated
                    } else {
                        // 新規地震情報を先頭に追加（最大50件保持）
                        return [quake, ...prev].slice(0, 50)
                    }
                })

                const place = quake.earthquake?.hypocenter?.name || "震源地不明"
                SET_ALERT({
                    open: true,
                    status: 'info',
                    message: `【リアルタイム地震情報】${place} 付近で地震を受信しました`
                })
            }

            // 552: 津波予報
            if (data.code === 552) {
                const tsunami = data as JmaTsunami
                setTsunamiHistories(tsunami)
                SET_ALERT({
                    open: true,
                    status: tsunami.cancelled ? 'info' : 'warning',
                    message: tsunami.cancelled
                        ? '津波予報が解除されました'
                        : '【津波予報発表】最新の津波情報を受信しました'
                })
            }
        } catch (err) {
            console.error("P2Pquake WebSocket message parse error:", err)
        }
    }, [SET_ALERT])

    // WebSocket切断処理
    const disconnectWs = useCallback(() => {
        if (reconnectTimerRef.current) {
            clearTimeout(reconnectTimerRef.current)
            reconnectTimerRef.current = null
        }
        if (wsRef.current) {
            wsRef.current.onopen = null
            wsRef.current.onclose = null
            wsRef.current.onerror = null
            wsRef.current.onmessage = null
            wsRef.current.close()
            wsRef.current = null
            setWsStatus('CLOSED')
        }
    }, [])

    // WebSocket接続処理
    const connectWs = useCallback(() => {
        if (isUnmountingRef.current) return
        if (wsRef.current && (wsRef.current.readyState === WebSocket.OPEN || wsRef.current.readyState === WebSocket.CONNECTING)) {
            return
        }

        try {
            setWsStatus('CONNECTING')
            const ws = new WebSocket(P2P_QUAKE_WS_URL)
            wsRef.current = ws

            ws.onopen = () => {
                setWsStatus('OPEN')
                console.log(`[P2Pquake WS] Connected to ${P2P_QUAKE_WS_URL}`)
            }

            ws.onmessage = handleWebSocketMessage

            ws.onerror = (error) => {
                console.error("[P2Pquake WS] Error:", error)
            }

            ws.onclose = (event) => {
                console.log(`[P2Pquake WS] Closed (code: ${event.code})`)
                setWsStatus('CLOSED')
                wsRef.current = null

                // アンマウント時以外の切断であれば5秒後に自動再接続
                if (!isUnmountingRef.current) {
                    if (reconnectTimerRef.current) {
                        clearTimeout(reconnectTimerRef.current)
                    }
                    reconnectTimerRef.current = setTimeout(() => {
                        console.log("[P2Pquake WS] Reconnecting...")
                        connectWs()
                    }, 5000)
                }
            }
        } catch (e) {
            console.error("[P2Pquake WS] Connection failed:", e)
            setWsStatus('CLOSED')
        }
    }, [P2P_QUAKE_WS_URL, handleWebSocketMessage])

    useEffect(() => {
        isUnmountingRef.current = false

        if (autoConnect) {
            connectWs()
        }

        return () => {
            isUnmountingRef.current = true
            disconnectWs()
        }
    }, [autoConnect, connectWs, disconnectWs])

    return {
        p2pHistories,
        tsunamiHistories,
        getP2pHistories,
        getTsunamiHistories,
        wsStatus,
        connectWs,
        disconnectWs
    }
}

export default useP2PquakeApi
