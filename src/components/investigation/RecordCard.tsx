import type { InvestigationRecord } from '../../types/investigation';

interface RecordCardProps {
    record: InvestigationRecord;
}

export const RecordCard = ({ record }: RecordCardProps) => {
    // "Suspicion" Factor Logic
    const isSuspicious = record.type === 'tip' && record.person === 'Anonymous';
    const isCheckin = record.type === 'checkin';
    
    let cardClass = "glass-panel record-card animate-slide-in";
    if (isSuspicious) cardClass += " suspicious-tip";
    else if (isCheckin) cardClass += " checkin-record";

    let badgeClass = "record-badge";
    if (isSuspicious) badgeClass += " suspicious";
    else if (isCheckin) badgeClass += " checkin";

    return (
        <div className={cardClass} style={{ animationFillMode: 'both' }}>
            <div className="record-header">
                <div className="record-title-group">
                    <span className={badgeClass}>
                        {record.type}
                    </span>
                    <h3 className="record-person">{record.person}</h3>
                </div>
                <span className="record-time">
                    {record.timestamp.toLocaleString()}
                </span>
            </div>
            {record.location && (
                <div className="record-location">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                    {record.location}
                </div>
            )}
            <p className="record-content">
                {record.content}
            </p>
        </div>
    );
};
