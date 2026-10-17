import { FC, ReactNode, useEffect } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import L, { LatLngExpression } from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import { Box } from '@mui/material';

// Vite等でのLeafletマーカーアイコンのパス解決対策
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconUrl: markerIcon,
    iconRetinaUrl: markerIcon2x,
    shadowUrl: markerShadow,
});

type Props = {
    children?: ReactNode
    width?: string | number | object
    height?: string | number | object
    center?: LatLngExpression | undefined
    zoom?: number
};

// center または zoom の変更を検知して地図の視点を滑らかに移動させるコンポーネント
const MapController: FC<{ center?: LatLngExpression; zoom?: number }> = ({ center, zoom }) => {
    const map = useMap();
    useEffect(() => {
        if (center) {
            map.flyTo(center, zoom ?? map.getZoom(), { duration: 1.2 });
        }
    }, [center, zoom, map]);
    return null;
};

const RootMapContainer: FC<Props> = (props) => {
    const {
        children = undefined,
        width = '100%',
        height = '600px',
        center = [35.681236, 139.767125], // デフォルト: 東京駅周辺
        zoom = 13,
    } = props

    return (
        <Box sx={{
            width,
            height,
            overflow: 'hidden',
            // 国土地理院の淡色地図をダークモード化（マーカーやポップアップには影響しません）
            '& .leaflet-tile-pane': {
                filter: 'brightness(0.75) invert(1) contrast(1.3) hue-rotate(200deg) saturate(0.3)',
            },
            // タイル読み込み中の背景チラつき防止
            '& .leaflet-container': {
                backgroundColor: '#1a1a1a',
            },
        }}>
            <MapContainer
                center={center}
                zoom={zoom}
                scrollWheelZoom={true}
                style={{ height: '100%', width: '100%' }}
            >
                <MapController center={center} zoom={zoom} />
                <TileLayer
                    attribution='&copy; <a href="https://maps.gsi.go.jp/development/ichiran.html" target="_blank" rel="noopener noreferrer">国土地理院</a>'
                    url="https://cyberjapandata.gsi.go.jp/xyz/pale/{z}/{x}/{y}.png"
                    maxZoom={18}
                />
                {children}
            </MapContainer>
        </Box>
    );
};

export default RootMapContainer;
