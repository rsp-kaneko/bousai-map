import { Prefecture } from "./prefecture"

export type CoastLine = {
    id: number
    prefecture_id: number
    prefecture: Prefecture
    name: string
    latlngs: string
    delete_flg: number
    created_at: string
    updated_at: string
}
