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
    { id: '1', timestamp: new Date('2026-04-18T15:02:00'), type: 'sighting', person: 'Podo', location: 'Ankara Kalesi', content: 'Saw Podo with Kağan. Kağan was explaining something; Podo looked hesitant.', metadata: {} },
    { id: 'p5', timestamp: new Date('2026-04-18T14:50:00'), type: 'sighting', person: 'Podo', location: 'Atakule', content: 'Podo was seen looking at the city from Atakule. Kağan was with him.', metadata: {} },
    { id: 'p4', timestamp: new Date('2026-04-18T14:35:00'), type: 'sighting', person: 'Podo', location: 'Seğmenler Parkı', content: 'Podo resting on a bench. Seemed to be waiting for someone.', metadata: {} },
    { id: 'p3', timestamp: new Date('2026-04-18T14:20:00'), type: 'sighting', person: 'Podo', location: 'Kuğulu Park', content: 'Feeding the swans. He looked calm but kept checking his watch.', metadata: {} },
    { id: 'p2', timestamp: new Date('2026-04-18T14:10:00'), type: 'sighting', person: 'Podo', location: 'Tunali Hilmi', content: 'Walking down the street. Carrying a small bag.', metadata: {} },
    { id: '6', timestamp: new Date('2026-04-18T14:00:00'), type: 'checkin', person: 'Podo', location: 'CerModern', content: 'Arrived at the gallery. Looking for the drop point.', metadata: {} },
    { id: '2', timestamp: new Date('2026-04-18T13:45:00'), type: 'message', person: 'Kağan', location: 'Hamamönü', content: 'Eray, tell them we were at Hamamönü all afternoon. The last stop is Atakule. Keep the secret safe.', metadata: {} },
    { id: '3', timestamp: new Date('2026-04-18T11:20:00'), type: 'checkin', person: 'Eray', location: 'Seğmenler Parkı', content: 'Waiting for Kağan. He is late.', metadata: {} },
    { id: '4', timestamp: new Date('2026-04-18T10:15:00'), type: 'tip', person: 'Anonymous', location: 'Tunali Hilmi', content: 'A suspicious figure was seen running away down the street.', metadata: {} },
    { id: '5', timestamp: new Date('2026-04-18T09:00:00'), type: 'note', person: 'Detective Harris', location: 'Eymir Lake', content: 'Investigation started. Podo is missing.', metadata: {} },
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
