import { useState } from 'react';
import { useInvestigation } from '../../hooks/useInvestigation';
import { useFilter } from '../../hooks/useFilter';
import { Timeline } from '../investigation/Timeline';
import { Sidebar } from '../layout/Sidebar';
import { Modal } from '../shared/Modal';
import { DetailView } from '../investigation/DetailView';
import { MapView } from '../investigation/MapView';
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
        if (rec) setSelectedRecord(rec);
    };

    return (
        <div className="split-screen-dashboard">
            <aside className="split-sidebar">
                <header className="split-header">
                    <h1 className="dashboard-title text-xl m-0" style={{ marginBottom: '0.25rem' }}>Ankara Case - 2026</h1>
                    <p className="dashboard-subtitle text-sm m-0">Aggregating intelligence from operatives.</p>
                </header>

                <div className="split-filters">
                    <Sidebar
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        selectedTypes={selectedTypes}
                        toggleType={toggleType}
                        reliability={reliability}
                        setReliability={setReliability}
                    />
                </div>

                <div className="split-timeline">
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
                </div>
            </aside>

            <main className="split-map">
                <MapView 
                    records={filteredRecords}
                    suspiciousIds={suspiciousIds}
                    hoveredRecordId={hoveredRecordId}
                    onMarkerClick={handleMapMarkerClick}
                />
            </main>

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
