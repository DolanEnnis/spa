
export interface Trip {
    typeTrip: string;
    extra?: string;
    note?: string;
    boarding: Date;
    confirmed?: boolean;
    submitted?: string;
    pilot: 'Fergal' | 'Brian' | 'Peter' | 'Fintan' | 'Mark' | 'Dave' | 'Paddy' | 'Cyril' | null;
    port: 'Anchorage' | 'Cappa' | 'Moneypoint' | 'Tarbert' | 'Foynes' | 'Aughinish' | 'Shannon' | 'Limerick' | null;
    // info required for pilot own info 
    pilotNo?: number;
    monthNo?: number;
    car?: string;
    good?: number;
    timeOff?: Date;
    pilotNotes?: string;
}