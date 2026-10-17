import L, { LatLngExpression } from "leaflet";
import { FC } from "react";
import { Marker } from "react-leaflet";

type Props = {
    position: LatLngExpression | undefined
}

const EpicenterMarker: FC<Props> = ({position}) => {
    const pulseIcon = L.divIcon({
        className: 'custom-pulse-marker',
        html: `
            <div class="pulse-icon-wrapper">
                <div class="pulse-icon-ring"></div>
                <div class="pulse-icon-ring delay"></div>
                <div class="pulse-icon-center"></div>
            </div>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 20],
    })

    return (
        <Marker
            position={position!}
            icon={pulseIcon}
        />
    )
}

export default EpicenterMarker
