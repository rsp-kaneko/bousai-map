import { JmaObservationPoint, JmaScale } from "@/types/p2pquake"
import { Dispatch, FC, SetStateAction } from "react"
import CustomDialog from "../Dialogs/CustomDialog"
import { Place } from "@mui/icons-material"
import AreaStatusContent from "../AreaStatusContent"

type Props = {
    open: boolean
    onClose: () => void
    points: JmaObservationPoint[]
    pointPrefs: Array<{pref: string, scale: JmaScale}>
    selectedPref: {pref: string, scale: JmaScale} | null
    setSelectedPref: Dispatch<SetStateAction<{pref: string, scale: JmaScale} | null>>
}

const MobileAreaStatusDialog: FC<Props> = ({
    open,
    onClose,
    points,
    pointPrefs,
    selectedPref,
    setSelectedPref
}) => {

    return (
        <CustomDialog
            open={open}
            onClose={onClose}
            title="発生エリア情報"
            subTitle="各都道府県別のエリア情報"
            icon={<Place />}
            color="#fc0"
        >
            <AreaStatusContent
                points={points}
                pointPrefs={pointPrefs}
                selectedPref={selectedPref}
                setSelectedPref={setSelectedPref}
            />
        </CustomDialog>
    )
}

export default MobileAreaStatusDialog
