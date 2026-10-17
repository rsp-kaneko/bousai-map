import { Prefecture } from "./prefecture"

export type PointLayer = {
    id: number
    prefecture_id: number
    prefecture: Prefecture
    class_name: string
    local_name: string
    latlng: string
    properties: string
    delete_flg: number
    created_at: string
    updated_at: string
}
