import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Charge } from '../shared/submittedTrip.model';

import { Patron } from '../shared/patron.model'
@Injectable()
export class DataService {
  trip: Charge = { ship: "" };
  private tripSource = new BehaviorSubject<Charge>(this.trip);
  currentTrip = this.tripSource.asObservable();
  private messageSource = new BehaviorSubject<string>("default message");
  currentMessage = this.messageSource.asObservable();

  constructor() { }

  changeTrip(trip: Charge) {
    this.tripSource.next(trip);
  }

  changeMessage(message: string) {

    this.messageSource.next(message);
  }

}