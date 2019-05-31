
export interface submittedTrip {
    ship: string;
    gt?: number;
    boarding?: Date;
    typeTrip?: string;
    extra?: string;
    note?: string;
    pilot?: 'Fergal' | 'Brian' | 'Peter' | 'Fintan' | 'Mark' | 'Dave' | 'Paddy' | 'Cyril' | null;
    port?: 'Anchorage' | 'Cappa' | 'Moneypoint' | 'Tarbert' | 'Foynes' | 'Aughinish' | 'Shannon' | 'Limerick' | null;
    extraCost?: number;
    pilotageCharge?: number;
    berthing?: number;
    incidental?: number;
    travel?: number;
    dateStamp?: Date;
}