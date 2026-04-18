import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { InvestigationRecord } from '../../types/investigation';

// ─── Mood / color config ──────────────────────────────────────────────────

const MOOD_COLORS: Record<string, string> = {
    'Neşeli':   '#22d3ee',
    'Meşgul':   '#a3e635',
    'Tedirgin': '#fbbf24',
    'Gergin':   '#f97316',
    'Kararsız': '#ef4444',
};

// ─── Marker factories ──────────────────────────────────────────────────────

const createCustomMarker = (isSuspicious: boolean, isHovered: boolean, isPulsing: boolean) => {
    const color = isSuspicious ? '#ef4444' : '#3b82f6';
    const classes = [
        'antigravity-marker',
        isHovered  ? 'leaflet-hover-bounce' : '',
        isSuspicious ? 'marker-glow-danger' : '',
        isPulsing  ? 'marker-pulse-cyan'    : '',
    ].filter(Boolean).join(' ');
    return L.divIcon({
        className: 'custom-div-icon',
        html: `<div class="${classes}" style="background-color:${color};"></div>`,
        iconSize: [16, 16], iconAnchor: [8, 8], popupAnchor: [0, -10],
    });
};

const createPodoMarker = (mood: string, isLastSeen: boolean, isActive: boolean) => {
    const color = MOOD_COLORS[mood] ?? '#22d3ee';
    const pulseClass = isLastSeen ? 'last-seen-pulse' : '';
    const activeStyle = isActive ? 'outline:2px solid white;outline-offset:3px;' : '';
    return L.divIcon({
        className: 'custom-div-icon',
        html: `<div class="podo-marker ${pulseClass}" style="background:${color};box-shadow:0 0 12px ${color};${activeStyle}"></div>`,
        iconSize: [14, 14], iconAnchor: [7, 7], popupAnchor: [0, -12],
    });
};

// ─── Internal map helpers ──────────────────────────────────────────────────

interface MapViewProps {
    records: InvestigationRecord[];
    suspiciousIds: Set<string>;
    hoveredRecordId: string | null;
    activeMode: 'intel' | 'suspects' | 'podo';
    activeRecordId: string | null;
    onMarkerClick: (id: string) => void;
}

const BoundsUpdater = ({ records }: { records: InvestigationRecord[] }) => {
    const map = useMap();
    const prevKey = useRef('');
    useEffect(() => {
        const coords = records.filter(r => r.coordinates).map(r => r.coordinates as [number, number]);
        const key = coords.map(c => c.join(',')).join('|');
        if (coords.length > 0 && key !== prevKey.current) {
            prevKey.current = key;
            map.fitBounds(L.latLngBounds(coords), { padding: [60, 60], animate: true });
        }
    }, [records, map]);
    return null;
};

const ActivePanner = ({ records, activeRecordId }: { records: InvestigationRecord[]; activeRecordId: string | null }) => {
    const map = useMap();
    const prevId = useRef<string | null>(null);
    useEffect(() => {
        if (!activeRecordId || activeRecordId === prevId.current) return;
        prevId.current = activeRecordId;
        const rec = records.find(r => r.id === activeRecordId);
        if (rec?.coordinates) {
            map.flyTo(rec.coordinates, 16, { duration: 1.2 });
        }
    }, [activeRecordId, records, map]);
    return null;
};

// ─── Main Component ────────────────────────────────────────────────────────

export const MapView = ({ records, suspiciousIds, hoveredRecordId, activeMode, activeRecordId, onMarkerClick }: MapViewProps) => {
    const center: [number, number] = [39.9208, 32.8541];

    // Hovered location — used to pulse all markers at the same coords (e.g. multiple CerModern records)
    const hoveredRecord = records.find(r => r.id === hoveredRecordId);
    const hoveredCoordKey = hoveredRecord?.coordinates?.join(',') ?? null;

    const podoRecords = records
        .filter(r => r.person === 'Podo' && r.coordinates)
        .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

    const displayRecords = activeMode === 'podo'
        ? podoRecords
        : records.filter(r => r.coordinates);

    const polylinePath: [number, number][] = podoRecords.map(r => r.coordinates as [number, number]);

    return (
        <div style={{ height: '100%', width: '100%', overflow: 'hidden' }}>
            <MapContainer center={center} zoom={13} style={{ height: '100%', width: '100%', zIndex: 0 }}>
                {/* Dark forensic tile layer — filter applied via CSS class */}
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
                    className="forensic-tile-layer"
                />

                {/* ── Podo Trail Polyline ── */}
                {activeMode === 'podo' && polylinePath.length > 1 && (
                    <>
                        <Polyline positions={polylinePath} pathOptions={{ color: '#22d3ee', weight: 8, opacity: 0.12 }} />
                        <Polyline
                            positions={polylinePath}
                            pathOptions={{ color: '#22d3ee', weight: 2.5, dashArray: '8 14', className: 'podo-trail-line' }}
                        />
                    </>
                )}

                {/* ── Markers ── */}
                {displayRecords.map(record => {
                    const isHovered    = hoveredRecordId === record.id;
                    const isActive     = activeRecordId === record.id;
                    const coordKey     = record.coordinates?.join(',') ?? '';
                    // Pulse if ANY record at this same coordinate is hovered (catches multiple CerModern records)
                    const isPulsing    = !!(hoveredCoordKey && coordKey === hoveredCoordKey && !isHovered);

                    const isAutoSuspicious = record.type === 'tip' && record.person === 'Anonymous';
                    const isSuspicious = suspiciousIds.has(record.id) || isAutoSuspicious;
                    const isPodo       = record.person === 'Podo';
                    const mood         = (record.metadata as any)?.mood ?? 'Neşeli';
                    const isLastSeen   = !!(record.metadata as any)?.isLastSeen;

                    const icon = isPodo
                        ? createPodoMarker(mood, isLastSeen, isActive)
                        : createCustomMarker(isSuspicious, isHovered || isActive, isPulsing);

                    return (
                        <Marker
                            key={record.id}
                            position={record.coordinates!}
                            icon={icon}
                            eventHandlers={{ click: () => onMarkerClick(record.id) }}
                            zIndexOffset={isLastSeen ? 2000 : isActive ? 1500 : isHovered ? 1000 : isSuspicious ? 500 : 0}
                        >
                            <Popup>
                                <div style={{ minWidth: '160px' }}>
                                    <div style={{ fontWeight: 700, marginBottom: '0.2rem' }}>{record.person}</div>
                                    <div style={{ color: '#555', fontSize: '0.8em', marginBottom: '0.4rem' }}>📍 {record.location}</div>
                                    <div style={{ fontSize: '0.85em', color: '#333', lineHeight: 1.4 }}>{record.content}</div>
                                    {isPodo && (
                                        <div style={{ marginTop: '0.5rem', fontSize: '0.75em', fontWeight: 600, color: MOOD_COLORS[mood] ?? '#22d3ee' }}>
                                            Mood: {mood}{isLastSeen ? ' 🔴 Son Görülme' : ''}
                                        </div>
                                    )}
                                </div>
                            </Popup>
                        </Marker>
                    );
                })}

                <BoundsUpdater records={displayRecords} />
                <ActivePanner records={records} activeRecordId={activeRecordId} />
            </MapContainer>
        </div>
    );
};
