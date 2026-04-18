import { useState, useMemo } from 'react';
import type { InvestigationRecord, RecordType } from '../types/investigation';

export const useFilter = (records: InvestigationRecord[]) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTypes, setSelectedTypes] = useState<Set<RecordType>>(
        new Set(['checkin', 'message', 'sighting', 'note', 'tip'])
    );
    const [reliability, setReliability] = useState<'all' | 'high'>('all');

    const toggleType = (type: RecordType) => {
        setSelectedTypes(prev => {
            const next = new Set(prev);
            if (next.has(type)) next.delete(type);
            else next.add(type);
            return next;
        });
    };

    const filteredRecords = useMemo(() => {
        return records.filter(record => {
            if (!selectedTypes.has(record.type)) return false;

            if (reliability === 'high') {
                // Heuristic: checkins and named tips/messages are higher reliability
                const isHigh = record.type === 'checkin' || record.person !== 'Anonymous';
                if (!isHigh) return false;
            }

            if (searchTerm.trim()) {
                const lowerTerm = searchTerm.toLowerCase();
                const matches = record.person.toLowerCase().includes(lowerTerm) ||
                                record.content.toLowerCase().includes(lowerTerm) ||
                                (record.location && record.location.toLowerCase().includes(lowerTerm)) ||
                                record.type.toLowerCase().includes(lowerTerm);
                if (!matches) return false;
            }

            return true;
        });
    }, [records, searchTerm, selectedTypes, reliability]);

    return { 
        searchTerm, setSearchTerm, 
        selectedTypes, toggleType, 
        reliability, setReliability,
        filteredRecords 
    };
};
