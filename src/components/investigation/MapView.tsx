import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { InvestigationRecord } from '../../types/investigation';

// Custom Antigravity Marker
const createCustomMarker = (isSuspicious: boolean, isHovered: boolean) => {
    const color = isSuspicious ? 'var(--danger-color, #ef4444)' : 'var(--accent-color, #3b82f6)';
    const bounceClass = isHovered ? 'leaflet-hover-bounce' : '';
    const glowClass = isSuspicious ? 'marker-glow-danger' : '';
    
    return L.divIcon({
        className: 'custom-div-icon',
        html: `<div class="antigravity-marker ${bounceClass} ${glowClass}" style="background-color: ${color};"></div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
        popupAnchor: [0, -10],
    });
};

interface MapViewProps {
    records: InvestigationRecord[];
    suspiciousIds: Set<string>;
    hoveredRecordId: string | null;
    onMarkerClick: (id: string) => void;
}

const BoundsUpdater = ({ records }: { records: InvestigationRecord[] }) => {
    const map = useMap();
    useEffect(() => {
        const coords = records.filter(r => r.coordinates).map(r => r.coordinates as [number, number]);
        if (coords.length > 0) {
            const bounds = L.latLngBounds(coords);
            map.fitBounds(bounds, { padding: [50, 50] });
        }
    }, [records, map]);
    return null;
};

export const MapView = ({ records, suspiciousIds, hoveredRecordId, onMarkerClick }: MapViewProps) => {
    const center: [number, number] = [39.9208, 32.8541]; // Ankara
    const recordsWithCoords = records.filter(r => r.coordinates);

    return (
        <MapContainer center={center} zoom={13} style={{ height: '100%', width: '100%', zIndex: 0 }}>
            {/* Using CartoDB Dark Matter for a sleek, high-contrast dark theme */}
            <TileLayer
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
            />
            {recordsWithCoords.map(record => {
                const isHovered = hoveredRecordId === record.id;
                // Inherit suspicion logic
                const isAutoSuspicious = record.type === 'tip' && record.person === 'Anonymous';
                const isSuspicious = suspiciousIds.has(record.id) || isAutoSuspicious;

                return (
                    <Marker 
                        key={record.id} 
                        position={record.coordinates!}
                        icon={createCustomMarker(isSuspicious, isHovered)}
                        eventHandlers={{
                            click: () => onMarkerClick(record.id)
                        }}
                        zIndexOffset={isHovered ? 1000 : (isSuspicious ? 500 : 0)}
                    >
                        <Popup className="antigravity-popup">
                            <div style={{ fontWeight: 600 }}>{record.person}</div>
                            <div style={{ color: '#666', fontSize: '0.85em' }}>{record.location}</div>
                        </Popup>
                    </Marker>
                );
            })}
            <BoundsUpdater records={recordsWithCoords} />
        </MapContainer>
    );
};
