import { useState } from 'react';
import { useInvestigation } from '../../hooks/useInvestigation';
import { useFilter } from '../../hooks/useFilter';
import { Timeline } from '../investigation/Timeline';
import { Sidebar } from '../layout/Sidebar';
import { Modal } from '../shared/Modal';
import { DetailView } from '../investigation/DetailView';
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

    const handleToggleSuspicious = (id: string) => {
        setSuspiciousIds(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    return (
        <div className="dashboard-container" style={{ maxWidth: '1200px' }}>
            <header className="dashboard-header animate-slide-in">
                <h1 className="dashboard-title">
                    Ankara Case - 2026
                </h1>
                <p className="dashboard-subtitle">
                    Aggregating intelligence from all field operatives and tip lines.
                </p>
            </header>

            <main className="dashboard-layout">
                <Sidebar
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    selectedTypes={selectedTypes}
                    toggleType={toggleType}
                    reliability={reliability}
                    setReliability={setReliability}
                />

                <div className="timeline-container">
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
                            onSelectRecord={setSelectedRecord}
                        />
                    )}
                </div>
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
