import { useRootContext } from "@/Contexts/RootContext"
import { CoastLine } from "@/types/coastLine"
import axios from "axios"
import { useCallback, useState } from "react"

const useCoastLine = () => {
    const {SET_ALERT, SET_IS_LOAD} = useRootContext()
    const [coastLines, setCoastLines] = useState<CoastLine[]>([])

    const storeCoastLines = useCallback((file: File) => {
        SET_IS_LOAD(true)
        const formData = new FormData()
        formData.append('file', file)
        axios.post(route('coastLines.storeLines'), formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
            .then((res) => {
                if (res.status === 200) {
                    SET_ALERT({open: true, status: 'success', message: '取り込みが完了しました'})
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

    const getCoastLines = useCallback((prefectureNames: string[]) => {
        axios.post(route('coastLines.getLines'), {prefectureNames})
            .then((res) => {
                if (res.status === 200) {
                    setCoastLines(res.data.coastLines)
                } else {
                    SET_ALERT({open: true, status: 'error', message: 'ServerErrorが発生しました'})
                    console.error(res.data.error)
                }
            })
            .catch((error) => {
                SET_ALERT({open: true, status: 'error', message: '海岸線データ取得中にエラーが発生しました'})
                console.error(error)
            })
    }, [])


    return {
        coastLines,
        storeCoastLines,
        getCoastLines
    }
}

export default useCoastLine
