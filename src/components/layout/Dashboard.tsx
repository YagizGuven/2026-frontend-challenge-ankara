import { useState } from 'react';
import { useInvestigation } from '../../hooks/useInvestigation';
import { useFilter } from '../../hooks/useFilter';
import { Timeline } from '../investigation/Timeline';
import { Sidebar } from '../layout/Sidebar';
import { Modal } from '../shared/Modal';
import { SegmentedControl } from '../shared/SegmentedControl';
import { DetailView } from '../investigation/DetailView';
import { MapView } from '../investigation/MapView';
import { InsightsPanel } from '../investigation/InsightsPanel';
import { SuspectProfiles } from '../investigation/SuspectProfiles';
import { PodoTrail } from '../investigation/PodoTrail';
import type { InvestigationRecord } from '../../types/investigation';

export const Dashboard = () => {
    const { records, loading, error } = useInvestigation();
    const {
        searchTerm, setSearchTerm,
        selectedTypes, toggleType,
        reliability, setReliability,
        filteredRecords
    } = useFilter(records);
    const [selectedRecord, setSelectedRecord] = useState<InvestigationRecord | null>(null);
    const [suspiciousIds, setSuspiciousIds] = useState<Set<string>>(new Set());
    const [hoveredRecordId, setHoveredRecordId] = useState<string | null>(null);
    const [activeRecordId, setActiveRecordId] = useState<string | null>(null);
    const [activeMode, setActiveMode] = useState<'intel' | 'suspects' | 'podo'>('intel');

    const handleToggleSuspicious = (id: string) => {
        setSuspiciousIds(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const handleMapMarkerClick = (id: string) => {
        setActiveRecordId(id);
        const rec = records.find(r => r.id === id);
        if (rec) {
            // Auto-switch tabs based on marker clicked
            if (rec.person === 'Podo') setActiveMode('podo');
            else setActiveMode('intel');

            setSelectedRecord(rec);
        }
    };

    return (
        <div className="split-screen-dashboard">
            <main className="split-map">
                <MapView 
                    records={filteredRecords}
                    suspiciousIds={suspiciousIds}
                    hoveredRecordId={hoveredRecordId}
                    activeMode={activeMode}
                    onMarkerClick={handleMapMarkerClick}
                />
            </main>

            <aside className="split-sidebar">
                <div className="sidebar-sticky-zone">
                    <header className="split-header" style={{ padding: '1rem 1.5rem 0.5rem' }}>
                        <h1 className="dashboard-title m-0" style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.5px', marginBottom: '0.75rem' }}>
                            ANKARA CASE <span className="text-muted" style={{ fontWeight: 400, fontSize: '0.85rem', marginLeft: '0.4rem' }}>Intelligence Briefing</span>
                        </h1>
                        <InsightsPanel records={records} />
                    </header>
                    
                    <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(0,0,0,0.1)' }}>
                        <SegmentedControl 
                            options={[
                                { label: 'Intel Feed', value: 'intel' },
                                { label: 'Suspects', value: 'suspects' },
                                { label: 'Podo Trail', value: 'podo' }
                            ]}
                            value={activeMode}
                            onChange={(v) => setActiveMode(v as any)}
                        />
                    </div>
                </div>

                <div className="sidebar-scroll-zone">
                    {activeMode === 'intel' && (
                        <>
                            <div className="search-container mb-4">
                                <input
                                    type="text"
                                    className="search-input"
                                    placeholder="Search suspect or keyword..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    style={{ width: '100%', maxWidth: 'none', paddingLeft: '1rem', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)' }}
                                />
                            </div>
                            <Sidebar
                                selectedTypes={selectedTypes}
                                toggleType={toggleType}
                                reliability={reliability}
                                setReliability={setReliability}
                            />

                            {loading ? (
                                <div className="loading-spinner-container">
                                    <div className="loading-spinner"></div>
                                </div>
                            ) : error ? (
                                <div className="glass-panel error-message">
                                    <p>Error loading investigation data: {error}</p>
                                </div>
                            ) : (
                                <Timeline
                                    records={filteredRecords}
                                    suspiciousIds={suspiciousIds}
                                    onSelectRecord={(rec) => { setSelectedRecord(rec); setActiveRecordId(rec.id); }}
                                    hoveredRecordId={hoveredRecordId}
                                    setHoveredRecordId={setHoveredRecordId}
                                    activeRecordId={activeRecordId}
                                />
                            )}
                        </>
                    )}

                    {activeMode === 'suspects' && (
                        <SuspectProfiles records={records} />
                    )}

                    {activeMode === 'podo' && (
                        <PodoTrail 
                            records={records} 
                            activeRecordId={activeRecordId}
                            onSelectRecord={(id) => {
                                const rec = records.find(r => r.id === id);
                                if (rec) {
                                    setSelectedRecord(rec);
                                    setActiveRecordId(id);
                                }
                            }}
                        />
                    )}
                </div>
            </aside>

            <Modal
                isOpen={!!selectedRecord}
                onClose={() => setSelectedRecord(null)}
                title={selectedRecord ? `${selectedRecord.type.toUpperCase()} - ${selectedRecord.id.substring(0, 8)}` : ''}
            >
                {selectedRecord && (
                    <DetailView
                        record={selectedRecord}
                        isSuspicious={suspiciousIds.has(selectedRecord.id)}
                        onToggleSuspicious={handleToggleSuspicious}
                    />
                )}
            </Modal>
        </div>
    );
};
