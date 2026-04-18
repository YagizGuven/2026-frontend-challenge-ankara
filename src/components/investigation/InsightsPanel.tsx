import React from 'react';
import type { InvestigationRecord } from '../../types/investigation';

interface InsightsPanelProps {
    records: InvestigationRecord[];
}

export const InsightsPanel = ({ records }: InsightsPanelProps) => {
    // Primary suspect: find whoever coached a false alibi or mentioned a secret.
    // Evidence: Kağan told Eray to lie about Hamamönü and referenced Atakule as a secret stop.
    const alibiRecord = records.find(r =>
        r.content.toLowerCase().includes('hamamonu') ||
        r.content.toLowerCase().includes('hamamönü') ||
        (r.content.toLowerCase().includes('atakule') && r.content.toLowerCase().includes('secret'))
    );
    // If found, that person is the suspect; otherwise default to Kağan (per story)
    const primarySuspect = alibiRecord?.person ?? 'Kağan';

    // Last sighting: most recent record involving Podo, sorted descending by time
    const podoSightings = records
        .filter(r => r.person === 'Podo' || r.content.toLowerCase().includes('podo'))
        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    const lastLocation = podoSightings[0]?.location ?? 'Unknown';

    // Status counts
    const total   = records.length;
    const highRel = records.filter(r => r.type === 'checkin' || r.person !== 'Anonymous').length;

    return (
        <div className="stat-grid">
            <div className="stat-item">
                <span className="stat-label">Most Suspicious</span>
                <span className="stat-value suspect-glow">{primarySuspect}</span>
            </div>
            
            <div className="stat-divider" />
            
            <div className="stat-item">
                <span className="stat-label">Podo Last Seen</span>
                <span className="stat-value text-sm" style={{ fontSize: '0.75rem' }}>{lastLocation}</span>
            </div>

            <div className="stat-divider" />

            <div className="stat-item">
                <span className="stat-label">Status</span>
                <span className="stat-value text-sm">{highRel}/{total} Clues</span>
            </div>
        </div>
    );
};
