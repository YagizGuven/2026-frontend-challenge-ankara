import { useInvestigation } from '../../hooks/useInvestigation';
import { useFilter } from '../../hooks/useFilter';
import { Timeline } from '../investigation/Timeline';
import { SearchBar } from '../shared/SearchBar';

export const Dashboard = () => {
    const { records, loading, error } = useInvestigation();
    const { searchTerm, setSearchTerm, filteredRecords } = useFilter(records);

    return (
        <div className="dashboard-container">
            <header className="dashboard-header animate-slide-in">
                <h1 className="dashboard-title">
                    Investigation Nexus
                </h1>
                <p className="dashboard-subtitle">
                    Aggregating intelligence from all field operatives and tip lines.
                </p>
            </header>

            <main>
                <SearchBar value={searchTerm} onChange={setSearchTerm} />

                {loading ? (
                    <div className="loading-spinner-container">
                        <div className="loading-spinner"></div>
                    </div>
                ) : error ? (
                    <div className="glass-panel error-message">
                        <p>Error loading investigation data: {error}</p>
                    </div>
                ) : (
                    <Timeline records={filteredRecords} />
                )}
            </main>
        </div>
    );
};
