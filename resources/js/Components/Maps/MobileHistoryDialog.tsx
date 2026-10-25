import { JmaQuake } from "@/types/p2pquake"
import { Dispatch, FC, SetStateAction } from "react"
import CustomDialog from "../Dialogs/CustomDialog"
import { ManageSearch } from "@mui/icons-material"
import HistoriesContent from "../HistoriesContent"

type Props = {
    open: boolean
    onClose: () => void
    p2pHistories: JmaQuake[]
    selectedHistory?: JmaQuake | null
    setSelectedHistory: Dispatch<SetStateAction<JmaQuake | null>>
}

const MobileHistoryDialog: FC<Props> = ({
    open,
    onClose,
    p2pHistories,
    selectedHistory,
    setSelectedHistory
}) => {

    return (
        <CustomDialog
            open={open}
            onClose={onClose}
            title="地震履歴"
            subTitle="過去の地震履歴一覧"
            icon={<ManageSearch />}
            color="#afa"
        >
            <HistoriesContent
                selectedHistory={selectedHistory}
                setSelectedHistory={setSelectedHistory}
                p2pHistories={p2pHistories}
            />
        </CustomDialog>
    )
}

export default MobileHistoryDialog
