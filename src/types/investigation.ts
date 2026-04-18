export type RecordType = 'checkin' | 'message' | 'sighting' | 'note' | 'tip';

export interface InvestigationRecord {
  id: string;
  timestamp: Date;
  type: RecordType;
  person: string;
  location?: string;
  content: string;
  metadata: any; // Raw data for the "Detail View"
}
