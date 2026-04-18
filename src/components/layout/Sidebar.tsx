import React from 'react';
import { SegmentedControl } from '../shared/SegmentedControl';
import type { RecordType } from '../../types/investigation';

interface SidebarProps {
    searchTerm: string;
    setSearchTerm: (val: string) => void;
    selectedTypes: Set<RecordType>;
    toggleType: (type: RecordType) => void;
    reliability: string;
    setReliability: (val: any) => void;
}

const RECORD_TYPES: RecordType[] = ['checkin', 'message', 'sighting', 'note', 'tip'];

export const Sidebar = ({ 
    selectedTypes, toggleType, 
    reliability, setReliability 
}: Omit<SidebarProps, 'searchTerm' | 'setSearchTerm'>) => {
    return (
        <div className="filter-group-container">
            <div className="mb-4">
                <label className="sidebar-label">Urgency & Reliability</label>
                <div style={{ marginTop: '0.5rem' }}>
                    <SegmentedControl 
                        options={[
                            { label: 'All Records', value: 'all' },
                            { label: 'High Reliability', value: 'high' }
                        ]}
                        value={reliability}
                        onChange={setReliability}
                    />
                </div>
            </div>

            <div className="mb-4">
                <label className="sidebar-label mb-2" style={{ display: 'block' }}>Source Types</label>
                <div className="pill-group mt-2">
                    {RECORD_TYPES.map(type => {
                        const active = selectedTypes.has(type);
                        return (
                            <button 
                                key={type} 
                                className={`pill-btn ${active ? 'active' : ''}`}
                                onClick={() => toggleType(type)}
                            >
                                {type.charAt(0).toUpperCase() + type.slice(1)}s
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
