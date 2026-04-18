import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { InvestigationRecord } from '../../types/investigation';

// ─── Custom Markers ────────────────────────────────────────────────────────

const createCustomMarker = (isSuspicious: boolean, isHovered: boolean) => {
    const color = isSuspicious ? 'var(--danger-color, #ef4444)' : 'var(--accent-color, #3b82f6)';
    const bounceClass = isHovered ? 'leaflet-hover-bounce' : '';
    const glowClass = isSuspicious ? 'marker-glow-danger' : '';
    
    return L.divIcon({
        className: 'custom-div-icon',
        html: `<div class="antigravity-marker ${bounceClass} ${glowClass}" style="background-color: ${color};"></div>`,
        iconSize: [16, 16],
        iconAnchor: [8, 8],
        popupAnchor: [0, -10],
    });
};

const createPodoTrailMarker = (isFinal: boolean) => {
    const color = isFinal ? 'var(--danger-color, #ef4444)' : '#00f2ff';
    const glowClass = isFinal ? 'marker-glow-final' : 'marker-glow-podo';
    const pulseClass = 'podo-pulse';
    
    return L.divIcon({
        className: 'custom-div-icon',
        html: `<div class="podo-trail-dot ${glowClass} ${pulseClass}" style="background-color: ${color};"></div>`,
        iconSize: [12, 12],
        iconAnchor: [6, 6],
        popupAnchor: [0, -8],
    });
};

// ─── Map Helpers ───────────────────────────────────────────────────────────

interface MapViewProps {
    records: InvestigationRecord[];
    suspiciousIds: Set<string>;
    hoveredRecordId: string | null;
    activeMode: 'intel' | 'suspects' | 'podo';
    onMarkerClick: (id: string) => void;
}

const BoundsUpdater = ({ records }: { records: InvestigationRecord[] }) => {
    const map = useMap();
    useEffect(() => {
        const coords = records.filter(r => r.coordinates).map(r => r.coordinates as [number, number]);
        if (coords.length > 0) {
            const bounds = L.latLngBounds(coords);
            map.fitBounds(bounds, { padding: [60, 60] });
        }
    }, [records, map]);
    return null;
};

// ─── Main Component ────────────────────────────────────────────────────────

export const MapView = ({ records, suspiciousIds, hoveredRecordId, activeMode, onMarkerClick }: MapViewProps) => {
    const center: [number, number] = [39.9208, 32.8541]; // Ankara
    
    // Sort Podo records for trail
    const podoTrail = records
        .filter(r => r.person === 'Podo' && r.coordinates)
        .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

    const podoCoords = podoTrail.map(r => r.coordinates as [number, number]);

    // Decide which markers to show
    const displayRecords = activeMode === 'podo' 
        ? podoTrail 
        : records.filter(r => r.coordinates);

    return (
        <div style={{ height: '100%', width: '100%', overflow: 'hidden' }}>
            <MapContainer center={center} zoom={13} style={{ height: '100%', width: '100%', zIndex: 0 }}>
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
                />

                {/* Draw Podo Trail Polyline */}
                {activeMode === 'podo' && podoCoords.length > 1 && (
                    <Polyline 
                        positions={podoCoords} 
                        pathOptions={{ 
                            color: '#00f2ff', 
                            weight: 3, 
                            dashArray: '10, 10',
                            className: 'animate-path-dash'
                        }} 
                    />
                )}

                {displayRecords.map((record, index) => {
                    const isHovered = hoveredRecordId === record.id;
                    const isAutoSuspicious = record.type === 'tip' && record.person === 'Anonymous';
                    const isSuspicious = suspiciousIds.has(record.id) || isAutoSuspicious;
                    
                    let icon;
                    if (activeMode === 'podo' && record.person === 'Podo') {
                        const isFinal = index === displayRecords.length - 1;
                        icon = createPodoTrailMarker(isFinal);
                    } else {
                        icon = createCustomMarker(isSuspicious, isHovered);
                    }

                    return (
                        <Marker 
                            key={record.id} 
                            position={record.coordinates!}
                            icon={icon}
                            eventHandlers={{
                                click: () => onMarkerClick(record.id)
                            }}
                            zIndexOffset={isHovered ? 1000 : (isSuspicious ? 500 : 0)}
                        >
                            <Popup className="antigravity-popup">
                                <div style={{ fontWeight: 600 }}>{record.person}</div>
                                <div style={{ color: 'var(--text-muted)', fontSize: '0.85em', marginBottom: '0.25rem' }}>{record.location}</div>
                                <div style={{ fontSize: '0.85rem' }}>{record.content}</div>
                            </Popup>
                        </Marker>
                    );
                })}
                
                <BoundsUpdater records={displayRecords} />
            </MapContainer>
        </div>
    );
};
