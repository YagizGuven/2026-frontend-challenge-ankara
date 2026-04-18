import { useState, useMemo } from 'react';
import type { InvestigationRecord } from '../types/investigation';

export const useFilter = (records: InvestigationRecord[]) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredRecords = useMemo(() => {
        if (!searchTerm.trim()) return records;
        
        const lowerTerm = searchTerm.toLowerCase();
        return records.filter(record => 
            record.person.toLowerCase().includes(lowerTerm) ||
            record.content.toLowerCase().includes(lowerTerm) ||
            (record.location && record.location.toLowerCase().includes(lowerTerm)) ||
            record.type.toLowerCase().includes(lowerTerm)
        );
    }, [records, searchTerm]);

    return { searchTerm, setSearchTerm, filteredRecords };
};
