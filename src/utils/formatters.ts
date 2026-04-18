import type { InvestigationRecord, RecordType } from '../types/investigation';

/** LOCATION_COORDINATES — strict coordinate mapping.
 *  Every record must snap to one of these exact points.
 *  Keys are pre-normalized (lower-case ASCII, no spaces). */
export const LOCATION_COORDINATES: Record<string, [number, number]> = {
    'cermodern':        [39.9329, 32.8465],
    'ankarakalesi':     [39.9416, 32.8647],
    'kalesi':           [39.9416, 32.8647],
    'atakule':          [39.8863, 32.8548],
    'segmenlerparki':   [39.8972, 32.8624],
    'segmenler':        [39.8972, 32.8624],
    'kugulupark':       [39.9077, 32.8609],
    'kugulu':           [39.9077, 32.8609],
    'tunalihilmi':      [39.9045, 32.8600],
    'tunali':           [39.9045, 32.8600],
    'hamamonu':         [39.9344, 32.8642],
    'kizilay':          [39.9208, 32.8541],
    'eymir':            [39.8242, 32.8258],
    'eymirlake':        [39.8242, 32.8258],
};

/** Normalize any location string to a plain ASCII key for LOCATION_COORDINATES.
 *  Uses Turkish locale lower-casing (İ→i, Ğ→g, Ş→s …) and strips all spaces. */
const toKey = (s: string): string =>
    s.toLocaleLowerCase('tr-TR')
     .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's')
     .replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
     .replace(/\s+/g, '');

const getLocationCoordinates = (locationStr: string): [number, number] | undefined => {
    if (!locationStr) return undefined;
    const key = toKey(locationStr);
    if (LOCATION_COORDINATES[key]) return LOCATION_COORDINATES[key];
    // Partial-match: "Seğmenler Parkı, Ankara" → matches 'segmenlerparki' then 'segmenler'
    for (const mapKey of Object.keys(LOCATION_COORDINATES)) {
        if (key.includes(mapKey)) return LOCATION_COORDINATES[mapKey];
    }
    return undefined; // no ghost markers for unknown locations
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
