import { DomesticTsunamiType, JmaScale } from "@/types/p2pquake"

const useBousai = () => {

    // 震度コードを日本語表記に変換
    const formatScale = (scale: JmaScale): string => {
        switch (scale) {
            case 10: return '震度1'
            case 20: return '震度2'
            case 30: return '震度3'
            case 40: return '震度4'
            case 45: return '震度5弱'
            case 46: return '震度5弱(推定)'
            case 50: return '震度5強'
            case 55: return '震度6弱'
            case 60: return '震度6強'
            case 70: return '震度7'
            default: return '震度不明'
        }
    }

    // 震度に応じたバッジ色
    const getScaleColor = (scale: JmaScale): string => {
        switch (scale) {
            case 10: return '#607d8b'
            case 20: return '#0288d1'
            case 30: return '#00897b'
            case 40: return '#fbc02d'
            case 45: return '#f57c00'
            case 46: return '#f57c00'
            case 50: return '#e64a19'
            case 55: return '#d32f2f'
            case 60: return '#b71c1c'
            case 70: return '#7b1fa2'
            default: return '#757575'
        }
    }

    // 津波情報の日本語変換
    const formatTsunami = (tsunami?: DomesticTsunamiType): string => {
        switch (tsunami) {
            case 'None': return '津波の心配なし'
            case 'NonEffective': return '若干の海面変動'
            case 'Checking': return '津波の有無を調査中'
            case 'Watch': return '津波注意報'
            case 'Warning': return '津波警報等'
            case 'Unknown': return '津波情報：不明'
            default: return '津波情報なし'
        }
    }

    // 津波情報に応じたバッジ色
    const getTsunamiColor = (tsunami?: DomesticTsunamiType): string => {
        switch (tsunami) {
            case 'Warning': return '#d32f2f'
            case 'Watch': return '#f57c00'
            case 'Checking': return '#fbc02d'
            case 'NonEffective': return '#0288d1'
            case 'None': return '#388e3c'
            default: return '#757575'
        }
    }

    // 津波レベル毎の色分け
    const getTsunamiGradeColor = (grade: string) => {
        switch (grade) {
            case 'MajorWarning': return '#f00'
            case 'Warning': return '#f70'
            case 'Watch': return '#ff0'
            case 'Unknown': return '#07f'
            default: return '#777'
        }
    }

    const formatTsunamiGrade = (grade: string) => {
        switch (grade) {
            case 'MajorWarning': return '大津波警報'
            case 'Warning': return '津波警報'
            case 'Watch': return '津波注意報'
            case 'Unknown': return '不明'
            default: return '確認中'
        }
    }


    return {
        formatScale,
        getScaleColor,
        formatTsunami,
        getTsunamiColor,
        getTsunamiGradeColor,
        formatTsunamiGrade
    }
}

export default useBousai
