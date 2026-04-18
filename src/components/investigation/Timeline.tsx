import { useEffect, useRef } from 'react';
import type { InvestigationRecord } from '../../types/investigation';
import { RecordCard } from './RecordCard';

interface TimelineProps {
    records: InvestigationRecord[];
    suspiciousIds: Set<string>;
    onSelectRecord: (record: InvestigationRecord) => void;
    hoveredRecordId: string | null;
    setHoveredRecordId: (id: string | null) => void;
    activeRecordId: string | null;
}

export const Timeline = ({ records, suspiciousIds, onSelectRecord, hoveredRecordId, setHoveredRecordId, activeRecordId }: TimelineProps) => {
    const listRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (activeRecordId && listRef.current) {
            const el = document.getElementById(`record-${activeRecordId}`);
            if (el) {
                el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    }, [activeRecordId]);
    if (records.length === 0) {
        return (
            <div className="glass-panel timeline-empty animate-slide-in">
                <svg className="timeline-empty-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <h3 className="timeline-empty-title">No clues found.</h3>
                <p className="timeline-empty-text">Try adjusting your search criteria or the investigation hasn't turned up anything yet.</p>
            </div>
        );
    }

    return (
        <div className="timeline-wrapper">
            <div className="timeline-line"></div>
            
            <div className="timeline-list" ref={listRef}>
                {records.map((record, index) => (
                    <div 
                        id={`record-${record.id}`}
                        key={record.id} 
                        className={`timeline-item ${activeRecordId === record.id ? 'highlighted' : ''}`} 
                        style={{ animationDelay: `${index * 0.05}s` }}
                        onMouseEnter={() => setHoveredRecordId(record.id)}
                        onMouseLeave={() => setHoveredRecordId(null)}
                    >
                        <div className="timeline-dot"></div>
                        <RecordCard 
                            record={record} 
                            isSuspicious={suspiciousIds.has(record.id)}
                            onClick={onSelectRecord}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};
