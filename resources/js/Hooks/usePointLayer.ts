import { useRootContext } from "@/Contexts/RootContext"
import { PointLayer } from "@/types/pointLayer"
import axios from "axios"
import { useCallback, useState } from "react"

const usePointLayer = () => {
    const {SET_ALERT, SET_IS_LOAD} = useRootContext()
    const [isLoad, setIsLoad] = useState(false)
    const [shelters, setShelters] = useState<PointLayer[]>([])

    // ポイントGeoJsonデータ取り込み
    const storePoints = useCallback((file: File) => {
        SET_IS_LOAD(true)
        const formData = new FormData()
        formData.append('file', file)
        axios.post(route('pointLayers.storePoints'), formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
            .then((res) => {
                if (res.status === 200) {
                    SET_ALERT({open: true, status: 'success', message: '取り込みが完了しました'})
                } else if (res.status === 400) {
                    SET_ALERT({open: true, status: 'error', message: res.data.error})
                } else {
                    SET_ALERT({open: true, status: 'error', message: 'ServerErrorが発生しました'})
                    console.error(res.data?.error)
                }
            })
            .catch((error) => {
                const message = error.response?.data?.error || 'アップロードに失敗しました'
                SET_ALERT({open: true, status: 'error', message})
                console.error(error)
            })
            .finally(() => SET_IS_LOAD(false))
    }, [])

    // 指定避難所、指定緊急避難場所ポイントデータ取得
    const getShelters = useCallback((data: {prefectureName: string, localName: string}) => {
        setIsLoad(true)
        axios.post(route('pointLayers.getShelters'), data)
            .then((res) => {
                if (res.status === 200) {
                    setShelters(res.data.shelters)
                } else {
                    SET_ALERT({open: true, status: 'error', message: 'ServerErrorが発生しました'})
                    console.error(res.data?.error)
                }
            })
            .catch((error) => {
                SET_ALERT({open: true, status: 'error', message: 'Mapデータ取得中にエラーが発生しました'})
                console.error(error)
            })
            .finally(() => setIsLoad(false))
    }, [])

    return {
        isLoad,
        shelters,
        getShelters,
        storePoints
    }
}

export default usePointLayer
