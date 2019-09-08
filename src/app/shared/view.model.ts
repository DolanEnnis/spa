import { Visit } from './visit.model';

export interface ViewInfo {
    ship: string;
    gt: number;
    pilot:
    | 'Fergal'
    | 'Brian'
    | 'Peter'
    | 'Fintan'
    | 'Mark'
    | 'Dave'
    | 'Paddy'
    | 'Cyril'
    | null;
    pilotOut?:
    | 'Fergal'
    | 'Brian'
    | 'Peter'
    | 'Fintan'
    | 'Mark'
    | 'Dave'
    | 'Paddy'
    | 'Cyril'
    | null;
    status: 'Due' | 'Awaiting Berth' | 'Alongside' | 'Sailed' | null;
    berth:
    | 'Anchorage'
    | 'Cappa'
    | 'Moneypoint'
    | 'Tarbert'
    | 'Foynes'
    | 'Aughinish'
    | 'Shannon'
    | 'Limerick'
    | null;
    boarded: any;
    pilotNo?: number;
    monthNo?: number;
    confirmed?: boolean;
    docid: string;
    visit?: Visit;
    car?: string;
    good?: number;
    timeOff?: Date;
    pilotNotes?: string;
    inout?: string;
    updateTime?: any;
    updateUser?: string;
    updatedBy?: any;
    marineTraffic?: string;
}
