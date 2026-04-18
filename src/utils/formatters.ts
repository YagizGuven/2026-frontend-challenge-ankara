import type { InvestigationRecord, RecordType } from '../types/investigation';

/** Single source of truth for all known Ankara locations.
 *  Keys are pre-normalized (lower-case ASCII, no spaces) so lookup is O(1) with no branching. */
export const LOCATION_MAP: Record<string, [number, number]> = {
    'cermodern':       [39.9248, 32.8465],
    'cermodern':       [39.9248, 32.8465], // alias: "Cer Modern"
    'segmenler':       [39.8946, 32.8631],
    'segmenlerparki':  [39.8946, 32.8631],
    'kizilay':         [39.9208, 32.8541],
    'atakule':         [39.8864, 32.8547],
    'kugulupark':      [39.9002, 32.8586],
    'kugulu':          [39.9002, 32.8586],
    'tunali':          [39.9075, 32.8617],
    'tunalihilmi':     [39.9075, 32.8617],
    'hamamonu':        [39.9427, 32.8608],
    'eymir':           [39.8242, 32.8258],
    'eymirlake':       [39.8242, 32.8258],
    'kalesi':          [39.9395, 32.8653],
    'ankarakalesi':    [39.9395, 32.8653],
};

/** Normalize any location string to a plain ASCII key for LOCATION_MAP.
 *  Handles Turkish locale casing (İ→i, Ğ→g …) and strips spaces / diacritics. */
const toKey = (s: string): string =>
    s.toLocaleLowerCase('tr-TR')
     .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's')
     .replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
     .replace(/\s+/g, '');

const getLocationCoordinates = (locationStr: string): [number, number] | undefined => {
    if (!locationStr) return undefined;
    const key = toKey(locationStr);
    if (LOCATION_MAP[key]) return LOCATION_MAP[key];
    // Partial-match fallback — handles "Seğmenler Parkı, Ankara" etc.
    for (const mapKey of Object.keys(LOCATION_MAP)) {
        if (key.includes(mapKey)) return LOCATION_MAP[mapKey];
    }
    return undefined; // unknown → no marker, no random drift
};

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
            coordinates: getLocationCoordinates(location),
            content,
            metadata: sub
        };
    });
};
