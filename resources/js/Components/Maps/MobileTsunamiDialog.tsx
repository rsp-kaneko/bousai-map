import { JmaTsunami } from "@/types/p2pquake"
import { FC } from "react"
import CustomDialog from "../Dialogs/CustomDialog"
import { Tsunami } from "@mui/icons-material"
import TsunamiStatusContent from "../TsunamiStatusContent"

type Props = {
    open: boolean
    onClose: () => void
    tsunamiHistories: JmaTsunami | null
}

const MobileTsunamiDialog: FC<Props> = ({
    open,
    onClose,
    tsunamiHistories
}) => {

    return (
        <CustomDialog
            open={open}
            onClose={onClose}
            title="津波情報"
            subTitle="この地震による津波の影響"
            icon={<Tsunami />}
            color="#0cf"
        >
            <TsunamiStatusContent
                tsunamiHistories={tsunamiHistories}
            />
        </CustomDialog>
    )
}

export default MobileTsunamiDialog
