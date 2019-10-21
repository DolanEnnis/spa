
export interface Charge {
    visitdocid?: string;
    updateTime?: any;
    ship: string;
    gt?: number;
    boardStamp?: number;
    boarding?: any;
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
    docid?: string;
}