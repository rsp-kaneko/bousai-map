import { useRootContext } from "@/Contexts/RootContext"
import { Prefecture } from "@/types/prefecture"
import axios from "axios"
import { useCallback, useState } from "react"

const usePrefecture = () => {
    const {SET_IS_LOAD, SET_ALERT} = useRootContext()
    const [isLoad, setIsLoad] = useState(false)
    const [prefectures, setPrefectures] = useState<Prefecture[]>([])

    // 都道府県図郭ポリゴンGeoJsonデータ取り込み
    const storePrefecturePolygons = useCallback((file: File) => {
        SET_IS_LOAD(true)
        const formData = new FormData()
        formData.append('file', file)
        axios.post(route('prefectures.storePolygons'), formData, {
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
                SET_ALERT({open: true, status: 'error', message: 'アップロードに失敗しました'})
                console.error(error)
            })
            .finally(() => SET_IS_LOAD(false))
    }, [])

    // 都道府県図郭ポリゴンデータ取得
    const getPrefecturePolygons = useCallback((prefectureNames: string[]) => {
        setIsLoad(true)
        axios.post(route('prefectures.getPolygons'), {prefectureNames})
            .then((res) => {
                if (res.status === 200) {
                    setPrefectures(res.data.prefectures)
                } else {
                    SET_ALERT({open: true, status: 'error', message: 'ServerErrorが発生しました'})
                    console.error(res.data.error)
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
        prefectures,
        getPrefecturePolygons,
        storePrefecturePolygons
    }
}

export default usePrefecture
