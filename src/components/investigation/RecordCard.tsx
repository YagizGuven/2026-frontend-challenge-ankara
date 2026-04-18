import type { InvestigationRecord } from '../../types/investigation';

interface RecordCardProps {
    record: InvestigationRecord;
    isSuspicious?: boolean;
    onClick?: (record: InvestigationRecord) => void;
}

export const RecordCard = ({ record, isSuspicious, onClick }: RecordCardProps) => {
    // "Suspicion" Factor Logic
    const isAutoSuspicious = record.type === 'tip' && record.person === 'Anonymous';
    const finalSuspicious = isSuspicious || isAutoSuspicious;
    const isCheckin = record.type === 'checkin';
    
    // Accent color logic
    let accentColor = '#3b82f6'; // blue default
    if (record.type === 'tip') accentColor = '#ef4444'; // red
    else if (record.type === 'sighting') accentColor = '#eab308'; // yellow
    else if (record.type === 'checkin') accentColor = '#10b981'; // green

    return (
        <div 
            className={`record-card-hud ${finalSuspicious ? 'suspicious-hud' : ''}`}
            style={{ borderLeftColor: accentColor, padding: '0.5rem 0.75rem' }}
            onClick={() => onClick && onClick(record)}
        >
            {/* ── Single-line header: badge · person · time ── */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.3rem' }}>
                <span style={{
                    fontSize: '0.6rem', fontWeight: 700, textTransform: 'uppercase',
                    padding: '0.05rem 0.35rem', borderRadius: '4px',
                    background: `${accentColor}25`, color: accentColor, letterSpacing: '0.04em'
                }}>{record.type}</span>
                <span style={{ fontWeight: 600, fontSize: '0.82rem', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {record.person}
                </span>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', flexShrink: 0 }}>
                    {record.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
            </div>

            {/* ── Content ── */}
            <p style={{ fontSize: '0.76rem', color: 'rgba(255,255,255,0.75)', margin: '0 0 0.3rem', lineHeight: 1.35,
                        display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {record.content}
            </p>

            {/* ── Footer ── */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.68rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>📍 {record.location || '—'}</span>
                <span
                    className="record-link-hud"
                    onClick={(e) => { e.stopPropagation(); onClick && onClick(record); }}
                >
                    Details →
                </span>
            </div>
        </div>
    );
};
