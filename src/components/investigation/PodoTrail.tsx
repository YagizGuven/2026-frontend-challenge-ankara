import React from 'react';
import type { InvestigationRecord } from '../../types/investigation';

interface PodoTrailProps {
    records: InvestigationRecord[];
    activeRecordId: string | null;
    onSelectRecord: (id: string) => void;
}

export const PodoTrail = ({ records, activeRecordId, onSelectRecord }: PodoTrailProps) => {
    const podoRecords = records.filter(r => r.person === 'Podo').sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

    return (
        <div className="podo-timeline" style={{ paddingTop: '0.5rem' }}>
            {podoRecords.map((r, i) => (
                <div key={r.id} className="podo-node" style={{ position: 'relative', paddingLeft: '1.5rem', paddingBottom: '1.5rem' }}>
                    <div style={{ position: 'absolute', left: 0, top: '4px', width: '10px', height: '10px', borderRadius: '50%', background: '#eab308', zIndex: 2, boxShadow: '0 0 8px #eab308' }} />
                    
                    {i < podoRecords.length - 1 && (
                        <div style={{ position: 'absolute', left: '4px', top: '14px', bottom: 0, width: '2px', background: 'rgba(234, 179, 8, 0.3)', zIndex: 1 }} />
                    )}
                    
                    <div 
                        className={`record-card-hud ${activeRecordId === r.id ? 'highlighted' : ''}`}
                        onClick={() => onSelectRecord(r.id)}
                        style={{ borderLeftColor: '#eab308', marginTop: '-6px', marginBottom: 0 }}
                    >
                        <div className="record-header-hud">
                            <h3 className="record-person-hud" style={{ color: '#eab308' }}>📍 {r.location}</h3>
                            <span className="record-time-hud">{r.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <p className="record-content-hud">{r.content}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};
