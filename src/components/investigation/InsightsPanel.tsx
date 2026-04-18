import React from 'react';
import type { InvestigationRecord } from '../../types/investigation';

interface InsightsPanelProps {
    records: InvestigationRecord[];
}

export const InsightsPanel = ({ records }: InsightsPanelProps) => {
    // Primary suspect: Manually set to Kağan per instructions.
    // Evidence: He coached Eray for a false alibi at Hamamönü and mentioned a 'secret' at Atakule.
    const primarySuspect = 'Kağan';

    // Last sighting: most recent record involving Podo, sorted descending by time
    const podoSightings = records
        .filter(r => r.person === 'Podo' || r.content.toLowerCase().includes('podo'))
        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    const lastLocation = podoSightings[0]?.location ?? 'Unknown';

    // Status counts
    const total   = records.length;
    const highRel = records.filter(r => r.type === 'checkin' || r.person !== 'Anonymous').length;

    return (
        <div style={{ display: 'flex', gap: '1rem', padding: '0 1.5rem 0.75rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ fontSize: '0.6rem', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>SUSPECT:</span>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#ff4b4b', textShadow: '0 0 8px rgba(255,75,75,0.3)' }}>{primarySuspect}</span>
            </div>
            
            <div style={{ width: '1px', height: '12px', background: 'rgba(255,255,255,0.1)', alignSelf: 'center' }} />
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ fontSize: '0.6rem', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>LAST SEEN:</span>
                <span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-main)' }}>{lastLocation}</span>
            </div>

            <div style={{ width: '1px', height: '12px', background: 'rgba(255,255,255,0.1)', alignSelf: 'center' }} />

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ fontSize: '0.6rem', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>CLUES:</span>
                <span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-main)' }}>{highRel}/{total}</span>
            </div>
        </div>
    );
};
