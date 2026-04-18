import { useState, useEffect } from 'react';
import { fetchAllForms } from '../api/dataService';
import type { InvestigationRecord } from '../types/investigation';

export const useInvestigation = () => {
    const [records, setRecords] = useState<InvestigationRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const data = await fetchAllForms();
                setRecords(data);
            } catch (err: any) {
                setError(err.message || 'Failed to load records');
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    return { records, loading, error };
};
