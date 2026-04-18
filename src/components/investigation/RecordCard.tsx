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
    
    // Accent color logic
    let accentColor = '#3b82f6'; // blue default
    if (record.type === 'tip') accentColor = '#ef4444'; // red
    else if (record.type === 'sighting') accentColor = '#eab308'; // yellow
    else if (record.type === 'checkin') accentColor = '#10b981'; // green

    return (
        <div 
            className={`record-card-hud ${finalSuspicious ? 'suspicious-hud' : ''}`}
            style={{ borderLeftColor: accentColor }}
            onClick={() => onClick && onClick(record)}
        >
            <div className="record-header-hud">
                <h3 className="record-person-hud">{record.person}</h3>
                <span className="record-time-hud">
                    {record.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
            </div>
            
            <p className="record-content-hud">{record.content}</p>
            
            <div className="record-footer-hud">
                <span className="record-location-hud">📍 {record.location || 'Unknown'}</span>
                <span 
                    className="record-link-hud" 
                    onClick={(e) => { 
                        e.stopPropagation(); 
                        onClick && onClick(record); 
                    }}
                >
                    Details &rarr;
                </span>
            </div>
        </div>
    );
};
