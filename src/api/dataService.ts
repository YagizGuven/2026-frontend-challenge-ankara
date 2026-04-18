import { fetchFormSubmissions } from './jotform';
import { normalizeData } from '../utils/formatters';
import type { InvestigationRecord } from '../types/investigation';

const formIds = {
    checkin: import.meta.env.VITE_FORM_CHECKINS,
    message: import.meta.env.VITE_FORM_MESSAGES,
    sighting: import.meta.env.VITE_FORM_SIGHTINGS,
    note: import.meta.env.VITE_FORM_NOTES,
    tip: import.meta.env.VITE_FORM_TIPS,
};

const generateMockData = (): InvestigationRecord[] => [
    { id: '1', timestamp: new Date(Date.now() - 1000 * 60 * 10), type: 'checkin', person: 'Alice Vance', location: 'Ankara Kalesi', content: 'Arrived at the fortress. High vantage point secured.', metadata: {} },
    { id: '2', timestamp: new Date(Date.now() - 1000 * 60 * 45), type: 'tip', person: 'Anonymous', location: 'Seğmenler Parkı', content: 'Saw someone dropping a black briefcase near the edge of the park.', metadata: {} },
    { id: '3', timestamp: new Date(Date.now() - 1000 * 60 * 120), type: 'sighting', person: 'Bob Dylan', location: 'Tunali Hilmi', content: 'A suspicious figure was seen running away down the street.', metadata: {} },
    { id: '4', timestamp: new Date(Date.now() - 1000 * 60 * 180), type: 'message', person: 'Alice Vance', location: 'Atakule', content: 'I think I am being followed. Will drop the tracker soon.', metadata: {} },
    { id: '5', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), type: 'note', person: 'Detective Harris', location: 'Eymir Lake', content: 'Alice Vance and Bob Dylan might be connected. Check location records.', metadata: {} },
];

export const fetchAllForms = async (): Promise<InvestigationRecord[]> => {
    try {
        const [checkins, messages, sightings, notes, tips] = await Promise.all([
            fetchFormSubmissions(formIds.checkin).catch(() => []),
            fetchFormSubmissions(formIds.message).catch(() => []),
            fetchFormSubmissions(formIds.sighting).catch(() => []),
            fetchFormSubmissions(formIds.note).catch(() => []),
            fetchFormSubmissions(formIds.tip).catch(() => [])
        ]);

        const allEmpty = !checkins.length && !messages.length && !sightings.length && !notes.length && !tips.length;

        if (allEmpty) {
            console.warn("No data fetched (likely rate-limited). Falling back to mock investigation data.");
            return generateMockData().sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
        }

        const merged = [
            ...normalizeData(checkins, 'checkin'),
            ...normalizeData(messages, 'message'),
            ...normalizeData(sightings, 'sighting'),
            ...normalizeData(notes, 'note'),
            ...normalizeData(tips, 'tip'),
        ];

        return merged.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    } catch (error) {
        console.error("Error fetching form submissions", error);
        return generateMockData();
    }
};
