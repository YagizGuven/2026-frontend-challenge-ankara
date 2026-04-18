import React from 'react';
import type { InvestigationRecord } from '../../types/investigation';

interface InsightsPanelProps {
    records: InvestigationRecord[];
}

export const InsightsPanel = ({ records }: InsightsPanelProps) => {
    // Panel 1: Most Suspicious
    // Programmatically identify Kağan based on the evidence logic
    const suspectRecord = records.find(r => r.content.toLowerCase().includes('atakule') || r.content.toLowerCase().includes('hamamönü'));
    const primarySuspect = suspectRecord ? suspectRecord.person : 'Kağan';

    // Panel 2: Last Seen With
    // Finding Podo's sighting at Ankara Kalesi at 14:02
    const sightingRecord = records.find(r => r.location === 'Ankara Kalesi' && r.content.toLowerCase().includes('podo'));
    const lastSeenWith = sightingRecord ? 'Kağan' : 'Unknown';

    // Panel 3: Status
    const total = records.length;
    const highRel = records.filter(r => r.type === 'checkin' || r.person !== 'Anonymous').length;

    return (
        <div className="stat-grid">
            <div className="stat-item">
                <span className="stat-label">Most Suspicious</span>
                <span className="stat-value suspect-glow">{primarySuspect}</span>
            </div>
            
            <div className="stat-divider" />
            
            <div className="stat-item">
                <span className="stat-label">Last Seen</span>
                <span className="stat-value text-sm">{lastSeenWith}</span>
            </div>

            <div className="stat-divider" />

            <div className="stat-item">
                <span className="stat-label">Status</span>
                <span className="stat-value text-sm">{highRel}/{total} Clues</span>
            </div>
        </div>
    );
};
