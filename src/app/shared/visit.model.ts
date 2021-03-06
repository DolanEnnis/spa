import { Trip } from './trip.model';

export interface Visit {
    ship: string;
    gt: number;
    eta: any;
    etaTime?: any;
    status: 'Due' | 'Awaiting Berth' | 'Alongside' | 'Sailed' | null;
    inward: Trip;
    inwardConfirmed?: boolean;
    outward: Trip;
    outwardConfirmed?: boolean;
    marineTraffic?: string;
    extra?: [Trip];
    update?: 'Sheet' | 'AIS' | 'Good Guess' | 'Agent' | 'Pilot' | 'Other' | null;
    shipNote?: string;
    updateTime?: any;
    updateUser?: string;
    updatedBy?: any;
    docid?: string;
    //These need not be saved used to manipulate views!
    officeTime?: any;
    berth?: 'Anchorage' | 'Cappa' | 'Moneypoint' | 'Tarbert' | 'Foynes' | 'Aughinish' | 'Shannon' | 'Limerick' | null;
    note?: string;
    pilot?: string;
}

