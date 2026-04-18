import React from 'react';
import type { InvestigationRecord } from '../../types/investigation';

interface SuspectProfilesProps {
    records: InvestigationRecord[];
}

export const SuspectProfiles = ({ records }: SuspectProfilesProps) => {
    // Group records by person
    const suspectsMap = new Map<string, InvestigationRecord[]>();
    records.forEach(r => {
        if (r.person === 'Anonymous' || r.person === 'Podo' || r.person === 'Detective Harris') return;
        if (!suspectsMap.has(r.person)) suspectsMap.set(r.person, []);
        suspectsMap.get(r.person)!.push(r);
    });

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {Array.from(suspectsMap.entries()).map(([person, personRecords]) => {
                // Kağan logic check: coached Eray at Hamamönü, Atakule secret
                const isPrime = personRecords.some(r => r.content.toLowerCase().includes('atakule') || r.content.toLowerCase().includes('hamamönü'));
                const sortedRecords = [...personRecords].sort((a,b) => b.timestamp.getTime() - a.timestamp.getTime());
                const lastRecord = sortedRecords[0];

                return (
                    <div key={person} className={`record-card-hud ${isPrime ? 'suspicious-hud' : ''}`} style={{ borderLeftColor: isPrime ? '#ef4444' : '#3b82f6', marginBottom: 0 }}>
                        <div className="record-header-hud">
                            <h3 className="record-person-hud" style={{ fontSize: '1rem' }}>{person}</h3>
                            <span className="record-badge" style={{ background: isPrime ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255,255,255,0.1)', color: isPrime ? '#ef4444' : '#ccc', fontSize: '0.65rem' }}>
                                {isPrime ? 'Prime Suspect' : 'Person of Interest'}
                            </span>
                        </div>
                        <div style={{ marginTop: '0.75rem', fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', display: 'grid', gap: '0.25rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: 'var(--text-muted)' }}>Clues Connected:</span>
                                <span>{personRecords.length} records</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: 'var(--text-muted)' }}>Last Seen:</span>
                                <span>{lastRecord.location} ({lastRecord.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})</span>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};
