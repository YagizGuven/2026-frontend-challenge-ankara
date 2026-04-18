import type { InvestigationRecord } from '../../types/investigation';
import { Button } from '../shared/Button';

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
    
    let cardClass = "glass-panel record-card animate-slide-in";
    if (finalSuspicious) cardClass += " suspicious-tip";
    else if (isCheckin) cardClass += " checkin-record";

    let badgeClass = "record-badge";
    if (finalSuspicious) badgeClass += " suspicious";
    else if (isCheckin) badgeClass += " checkin";

    return (
        <div 
            className={cardClass} 
            style={{ animationFillMode: 'both', cursor: onClick ? 'pointer' : 'default' }}
            onClick={() => onClick && onClick(record)}
        >
            <div className="record-header">
                <div className="record-title-group">
                    <span className={badgeClass}>
                        {record.type}
                    </span>
                    <h3 className="record-person" style={{ fontWeight: 700 }}>{record.person}</h3>
                </div>
                <span className="record-time" style={{ textAlign: 'right' }}>
                    {record.timestamp.toLocaleDateString()} <br />
                    {record.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={(e) => {
                        e.stopPropagation();
                        onClick && onClick(record);
                    }}
                >
                    See Details
                </Button>
            </div>
        </div>
    );
};
