import type { InvestigationRecord, RecordType } from '../types/investigation';

export const normalizeData = (rawData: any[], type: RecordType): InvestigationRecord[] => {
    return rawData.map(sub => {
        const answers = sub.answers || {};
        let person = 'Unknown';
        let location = '';
        let content = '';

        // Extract information heuristically since we don't know exact field IDs
        for (const key in answers) {
            const answer = answers[key];
            const text = (answer.text || '').toLowerCase();
            const val = answer.answer;

            if (!val) continue;

            if (text.includes('name') || text.includes('person') || text.includes('who')) {
                person = typeof val === 'object' && val.first ? `${val.first} ${val.last}` : String(val);
            } else if (text.includes('location') || text.includes('place') || text.includes('where')) {
                location = String(val);
            } else if (text.includes('message') || text.includes('note') || text.includes('tip') || text.includes('sighting') || text.includes('detail') || text.includes('content') || text.includes('description')) {
                content = String(val);
            } else if (!content && typeof val === 'string' && val.length > 15) {
                content = val;
            }
        }

        if (!content) content = `A ${type} was recorded.`;
        if (type === 'tip' && person === 'Unknown') person = 'Anonymous';

        return {
            id: sub.id || Math.random().toString(36).substring(7),
            timestamp: new Date(sub.created_at || Date.now()),
            type,
            person,
            location,
            content,
            metadata: sub
        };
    });
};
