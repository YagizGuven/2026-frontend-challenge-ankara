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
    searchTerm, setSearchTerm, 
    selectedTypes, toggleType, 
    reliability, setReliability 
}: SidebarProps) => {
    return (
        <aside className="filter-sidebar">
            <div className="mb-6">
                <label className="sidebar-label">Person of Interest / Keyword</label>
                <div style={{ marginTop: '0.5rem' }}>
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Search suspects..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ width: '100%', maxWidth: 'none', paddingLeft: '1rem' }}
                    />
                </div>
            </div>

            <div className="mb-6">
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

            <div className="mb-6">
                <label className="sidebar-label mb-2" style={{ display: 'block' }}>Source Types</label>
                <div className="flex flex-col gap-2 mt-2">
                    {RECORD_TYPES.map(type => (
                        <label key={type} className="checkbox-label">
                            <input 
                                type="checkbox" 
                                className="custom-checkbox"
                                checked={selectedTypes.has(type)}
                                onChange={() => toggleType(type)}
                            />
                            <span className="checkbox-text">{type.charAt(0).toUpperCase() + type.slice(1)}s</span>
                        </label>
                    ))}
                </div>
            </div>
        </aside>
    );
};
