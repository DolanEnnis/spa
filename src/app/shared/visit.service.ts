import { Injectable, OnInit, OnDestroy } from '@angular/core'; //left out Input
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from 'angularfire2/firestore';

import { Subject } from 'rxjs/Subject';
import { Observable, Subscription, BehaviorSubject } from 'rxjs';
import { now } from 'moment';

import { AuthService } from '../auth/auth.service';
import { DataService } from '../shared/data.service';

import { Visit } from './visit.model';
import { Trip } from './trip.model';
import { error } from 'util';
import { Timestamp } from '@firebase/firestore-types';
import { filter } from 'rxjs/operators';

@Injectable()
export class VisitService implements OnInit, OnDestroy {
  private fbSubs: Subscription[] = []; //List of subscriptions to Firebase
  allTripsChanged = new Subject<Visit[]>();
  public visit: Visit;
  visitDoc: AngularFirestoreDocument<Visit>;
  currentVisitSource = new BehaviorSubject<Visit>(null);
  currentVisit$ = this.currentVisitSource.asObservable();
  subscriptions: Subscription[];
  message: String;
  today: number;
  public pilotFlag: boolean = false;

  constructor(
    private db: AngularFirestore,
    private authService: AuthService,
    private data: DataService
  ) {
    this.today = now() / 1000;
    this.fbSubs.push(
      this.data.currentMessage.subscribe(message => (this.message = message))
    );
  }

  ngOnInit() {
  }


  fetchVisits() {
    this.fbSubs.push(
      this.db
        .collection('visits')
        .valueChanges()
        .subscribe(
          (visits: Visit[]) => {
            this.allTripsChanged.next(visits);
          },
          error => {
            console.log('The error is in fetchVisits!');
            console.log(error);
          }
        )
    );
  }

  setNewVisit(info) {
    console.log(this.getUseruid());
    (this.visit = {
      ship: this.formatShipName(info.ship),
      gt: info.gt,
      eta: info.eta,
      marineTraffic: info.marineTraffic,
      inward: {
        typeTrip: 'inward',
        boarding: null,
        confirmed: false,
        pilot: null,
        port: info.port,
        pilotNotes: null,
      },
      outward: {
        typeTrip: 'outward',
        boarding: null,
        confirmed: false,
        pilot: null,
        port: info.port,
        pilotNotes: null,
      },
      status: 'Due',
      updateTime: Date.now(),
      shipNote: info.shipNote,
      updateUser: this.getUseruid(),
      update: info.update,
      officeTime: info.eta,
      berth: info.port,
      updatedBy: this.message,
    }),
      this.addDataToDatabase(this.visit);
  }

  updateVisit(info, docRef) {
    (this.visit = {
      ship: info.ship,
      eta: info.eta,
      gt: info.gt,
      marineTraffic: info.marineTraffic,
      inward: this.getInward(info),
      outward: this.getOutward(info),
      status: info.status,
      updateTime: Date.now(),
      shipNote: info.shipNote,
      updateUser: this.getUseruid(),
      update: info.update,
      officeTime: this.getOfficeTime(info),
      berth: info.berth,
      updatedBy: this.message,
    }),

      this.db
        .collection('visits')
        .doc(docRef)
        .update(this.visit)
        .then(() => console.log('Document successfully written!'))
        .catch(() => console.error('Error writing document: ', error));;
  }

  formatShipName(name) {
    //Return string with start of each letter as Upper case all others as lower case.
    const str = name.toLowerCase().replace(/\b[a-z]/g, function (letter) {
      return letter.toUpperCase();
    });
    return str;
  }

  getInward(info) {
    const returnValue = info.inward;
    if (typeof info.ownInwardTrip !== 'undefined') {
      returnValue.pilotNotes = info.ownInwardTrip.pilotNotes;
      returnValue.pilotNo = info.ownInwardTrip.pilotNo;
      returnValue.timeOff = info.ownInwardTrip.timeOff; //this is only saving a time with entry date needs work to get time off date!
      returnValue.monthNo = info.ownInwardTrip.monthNo;
      returnValue.car = info.ownInwardTrip.car;
      returnValue.good = info.ownInwardTrip.good;
      returnValue.extra = info.ownInwardTrip.extra;
    }
    return returnValue;
  }

  getOutward(info) {
    const returnValue = info.outward;
    if (typeof info.ownOutwardTrip !== 'undefined') {
      returnValue.pilotNotes = info.ownOutwardTrip.pilotNotes;
      returnValue.pilotNo = info.ownOutwardTrip.pilotNo;
      returnValue.timeOff = info.ownOutwardTrip.timeOff; //this is only saving a time with entry date needs work to get time off date!
      returnValue.monthNo = info.ownOutwardTrip.monthNo;
      returnValue.car = info.ownOutwardTrip.car;
      returnValue.good = info.ownOutwardTrip.good;
      returnValue.extra = info.ownOutwardTrip.extra;
    }
    return returnValue;
  }

  private addDataToDatabase(visit: Visit) {
    this.db
      .collection('visits')
      .add(visit)
      .then(docRef => {
        this.db
          .collection('visits')
          .doc(docRef.id)
          .update({
            docid: docRef.id,
          });
      });
  }

  getUseruid() {
    return this.authService.getUseruid();
  }

  getOfficeTime(info) {
    switch (info.status) {
      case 'Due': {
        info.berth = info.inward.port;
        if (!info.eta) {
          return 'No Info';
        }
        return info.eta;
      }
      case 'Waiting Berth': {
        info.berth = info.inward.port;
        if (!info.inward.boarding) {
          return 'No Info';
        }
        return info.inward.boarding;
      }
      case 'Alongside': {
        info.berth = info.outward.port;
        if (!info.outward.boarding) {
          return 'No Info';
        }
        return info.outward.boarding;
      }
      default: {
        info.berth = info.outward.port;
        return info.eta;
      }
    }
  }

  cancelSubscriptions() {
    this.fbSubs.forEach(sub => sub.unsubscribe);
  }

  changecurrentVisit(visit: Visit) {
    this.currentVisitSource.next(visit);
  }

  getColor(status) {
    switch (status) {
      case 'Due':
        return '#e6ffe6';
      case 'Waiting Berth':
        return '#e6e6ff';
      case 'Alongside':
        return '#ffffe6';
      default:
        return 'white';
    }
  }

  getBoarded(boarding) {
    if (boarding == null) {
      const sudoDate = Date.now() + 946080000; //If a boarding date is not fixed this makes a date 30 odd year in the future
      return sudoDate;
    }
    return boarding.seconds;
  }

  ngOnDestroy() {
    this.cancelSubscriptions();
  }
}
