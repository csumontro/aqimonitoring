import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import type { PollutionData } from '../../types';
import { getAQIDescription, getAQIHexColor, getScaleAQI } from '../../utils/aqi';
import { getBatchPollutionData } from '../../services/api';
import { MAJOR_CITIES } from '../../data/cities';
import L from 'leaflet';
import { useEffect, useState } from 'react';

// Fix for default marker icon
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface PollutionMapProps {
    data: PollutionData | null;
    lat: number;
    lon: number;
    onLocationSelect?: (lat: number, lon: number) => void;
}

function MapController({ lat, lon, onLocationSelect }: { lat: number, lon: number, onLocationSelect?: (lat: number, lon: number) => void }) {
    const map = useMap();

    useMapEvents({
        click(e) {
            if (onLocationSelect) {
                onLocationSelect(e.latlng.lat, e.latlng.lng);
            }
        }
    });

    useEffect(() => {
        map.flyTo([lat, lon], 10, {
            duration: 1.5
        });
    }, [lat, lon, map]);
    return null;
}

export default function PollutionMap({ data, lat, lon, onLocationSelect }: PollutionMapProps) {
    const [heatmapData, setHeatmapData] = useState<PollutionData[]>([]);

    useEffect(() => {
        const fetchHeatmapData = async () => {
            const data = await getBatchPollutionData(MAJOR_CITIES);
            setHeatmapData(data);
        };
        fetchHeatmapData();
    }, []);

    // Custom marker for pollution - Heatmap Style
    const getCustomIcon = (aqi: number, isSelected: boolean = false) => {
        let scaleAQI = 1;
        if (aqi > 20) scaleAQI = 2;
        if (aqi > 40) scaleAQI = 3;
        if (aqi > 60) scaleAQI = 4;
        if (aqi > 80) scaleAQI = 5;

        const color = getAQIHexColor(scaleAQI);
        const size = isSelected ? 50 : 30; // Larger for selected

        // Create a glowing orb effect
        return L.divIcon({
            className: 'custom-div-icon',
            html: `
                <div style="
                    background-color: ${color};
                    width: ${size}px;
                    height: ${size}px;
                    border-radius: 50%;
                    opacity: ${isSelected ? 0.8 : 0.5};
                    filter: blur(${isSelected ? 12 : 6}px);
                    box-shadow: 0 0 ${isSelected ? 30 : 15}px ${color};
                    animation: pulse 3s infinite;
                "></div>
                <div style="
                    position: absolute;
                    top: ${isSelected ? 12 : 8}px;
                    left: ${isSelected ? 12 : 8}px;
                    background-color: ${color};
                    width: ${isSelected ? 26 : 14}px;
                    height: ${isSelected ? 26 : 14}px;
                    border-radius: 50%;
                    border: 2px solid rgba(255,255,255,0.9);
                    box-shadow: 0 0 10px rgba(0,0,0,0.5);
                "></div>
            `,
            iconSize: [size, size],
            iconAnchor: [size / 2, size / 2]
        });
    };

    const currentAQI = data?.current?.european_aqi || 0;

    return (
        <div className="h-full w-full rounded-2xl overflow-hidden shadow-2xl border border-border/50 relative group">
            <MapContainer
                center={[lat, lon]}
                zoom={4} // Zoomed out to see global view
                scrollWheelZoom={true}
                className="h-full w-full z-0"
                style={{ background: 'hsl(var(--background))' }} // Match app background to avoid white flashes
                minZoom={2}
            >
                {/* Using CartoDB Dark Matter for a sleek, minimal dark look that isn't "grayed out" */}
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    opacity={1}
                />
                <MapController lat={lat} lon={lon} onLocationSelect={onLocationSelect} />

                {/* Render Global Heatmap Markers */}
                {heatmapData.map((cityData, index) => {
                    const cityAQI = cityData.current?.european_aqi || 0;
                    return (
                        <Marker
                            key={`heatmap-${index}`}
                            position={[cityData.latitude, cityData.longitude]}
                            icon={getCustomIcon(cityAQI, false)}
                            eventHandlers={{
                                click: (e) => {
                                    L.DomEvent.stopPropagation(e); // Prevent map click
                                    if (onLocationSelect) {
                                        onLocationSelect(cityData.latitude, cityData.longitude);
                                    }
                                }
                            }}
                        >
                            <Popup className="custom-popup" closeButton={false}>
                                <div className="p-2 text-center">
                                    <div className="text-lg font-bold mb-1">{cityAQI}</div>
                                    <div className="text-[10px] font-medium uppercase tracking-wider opacity-80">{getAQIDescription(getScaleAQI(cityAQI))}</div>
                                </div>
                            </Popup>
                        </Marker>
                    );
                })}

                {/* Render Selected Location Marker (Larger) */}
                {data && (
                    <Marker
                        position={[data.latitude, data.longitude]}
                        icon={getCustomIcon(currentAQI, true)}
                        zIndexOffset={1000} // Always on top
                    >
                        <Popup className="custom-popup" closeButton={false}>
                            <div className="p-4 min-w-[200px]">
                                <div className="text-center mb-3 border-b border-border/50 pb-2">
                                    <div className="text-3xl font-bold mb-1">{currentAQI}</div>
                                    <div className="text-xs font-medium uppercase tracking-wider opacity-80">{getAQIDescription(getScaleAQI(currentAQI))}</div>
                                </div>

                                <div className="grid grid-cols-2 gap-2 text-xs">
                                    <div className="flex flex-col bg-muted/30 p-1.5 rounded">
                                        <span className="opacity-60 uppercase text-[10px]">PM2.5</span>
                                        <span className="font-mono font-bold">{data.current?.pm2_5}</span>
                                    </div>
                                    <div className="flex flex-col bg-muted/30 p-1.5 rounded">
                                        <span className="opacity-60 uppercase text-[10px]">PM10</span>
                                        <span className="font-mono font-bold">{data.current?.pm10}</span>
                                    </div>
                                    <div className="flex flex-col bg-muted/30 p-1.5 rounded">
                                        <span className="opacity-60 uppercase text-[10px]">NO₂</span>
                                        <span className="font-mono font-bold">{data.current?.nitrogen_dioxide}</span>
                                    </div>
                                    <div className="flex flex-col bg-muted/30 p-1.5 rounded">
                                        <span className="opacity-60 uppercase text-[10px]">O₃</span>
                                        <span className="font-mono font-bold">{data.current?.ozone}</span>
                                    </div>
                                </div>
                            </div>
                        </Popup>
                    </Marker>
                )}
            </MapContainer>

            {/* Overlay gradient for better integration with the dark theme */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-background/20 via-transparent to-background/40 z-[400]"></div>
        </div>
    );
}
