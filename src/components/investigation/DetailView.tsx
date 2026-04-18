import { useState } from 'react';
import type { InvestigationRecord } from '../../types/investigation';
import './DetailModal.css';

interface DetailViewProps {
    record: InvestigationRecord;
    isSuspicious: boolean;
    onToggleSuspicious: (id: string) => void;
}

export const DetailView = ({ record, isSuspicious, onToggleSuspicious }: DetailViewProps) => {
    const [showRaw, setShowRaw] = useState(false);

    return (
        <div>
            <div className="summary-grid">
                <div className="summary-item">
                    <span className="summary-label">Person of Interest</span>
                    <span className="summary-value font-medium">{record.person}</span>
                </div>
                <div className="summary-item">
                    <span className="summary-label">Timestamp</span>
                    <span className="summary-value">{record.timestamp.toLocaleString()}</span>
                </div>
                {record.location && (
                    <div className="summary-item">
                        <span className="summary-label">Location</span>
                        <span className="summary-value">{record.location}</span>
                    </div>
                )}
                <div className="summary-item">
                    <span className="summary-label">Content</span>
                    <span className="summary-value" style={{ lineHeight: 1.6 }}>{record.content}</span>
                </div>
            </div>

            <div className="switch-container">
                <div>
                    <div className="font-medium">Mark as Suspicious</div>
                    <div className="text-sm text-[color:var(--text-muted)]">Flag this record for further review</div>
                </div>
                <label className="switch">
                    <input 
                        type="checkbox" 
                        checked={isSuspicious} 
                        onChange={() => onToggleSuspicious(record.id)} 
                    />
                    <span className="slider"></span>
                </label>
            </div>

            <div className="accordion">
                <button 
                    className="accordion-header" 
                    onClick={() => setShowRaw(!showRaw)}
                >
                    Raw Jotform Metadata
                    <svg 
                        width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                        style={{ transform: showRaw ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>
                {showRaw && (
                    <div className="accordion-content">
                        <pre style={{ margin: 0 }}>
                            {JSON.stringify(record.metadata, null, 2)}
                        </pre>
                    </div>
                )}
            </div>
        </div>
    );
};
