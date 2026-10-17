
export type Prefecture = {
    id: number
    prefecture_polygon: PrefecturePolygon
    region: string
    name: string
    delete_flg: number
    created_at: string
    updated_at: string
}

export type PrefecturePolygon = {
    id: number
    name: string
    point: string
    latlngs: string
    delete_flg: number
    created_at: string
    updated_at: string
}
