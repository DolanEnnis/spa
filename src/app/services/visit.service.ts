import { Injectable, OnInit, OnDestroy } from '@angular/core'; //left out Input
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from 'angularfire2/firestore';


import { Subject, Observable, Subscription, BehaviorSubject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { now } from 'moment';

import { AuthService } from '../auth/auth.service';
import { DataService } from './data.service';
import { ChargesService } from './charges.service'

import { Visit } from '../shared/visit.model';
//import { Trip } from '../shared/trip.model';
//import { Charge } from '../shared/submittedTrip.model';
//import { error } from 'util';
//import { filter } from 'rxjs/operators';
import * as moment from 'moment';
import { Charge } from '../shared/submittedTrip.model';


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
  trip: Charge;
  today: number;
  public pilotFlag: boolean = false;
  myMoment: moment.Moment = moment();


  constructor(
    private chargesService: ChargesService,
    private route: ActivatedRoute,
    private router: Router,
    private db: AngularFirestore,
    private authService: AuthService,
    private data: DataService
  ) {
    this.today = now() / 1000;
    this.fbSubs.push(
      this.data.currentMessage.subscribe(message => (this.message = message)),
      this.data.currentTrip.subscribe(trip => (this.trip = trip))
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
    console.log("Setting new Visit " + this.getUseruid());
    let fulleta = this.combineTime(info.eta, info.etaTime);
    (this.visit = {
      ship: this.formatShipName(info.ship),
      gt: info.gt,
      eta: fulleta,
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
      officeTime: fulleta,
      berth: info.port,
      updatedBy: this.message,
    }),
      this.addDataToDatabase(this.visit);
  }

  updateVisit(info, docRef) {
    info.eta = this.combineTime(info.eta, info.etaTime);
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
        .catch(() => console.error('Error writing document: ', Error));;
  }

  updateConfirmed(docRef, tripDirection, trip) {
    console.log(trip)
    this.chargesService.addChargeToDatabase(trip);
    if (tripDirection == "i") {
      this.db
        .collection('visits')
        .doc(docRef)
        .update({ "inwardConfirmed": true })
        //for some reason in changing inward.submitted cleared outward.submitted
        .then(() => this.router.navigate(['stationBook']))
        .catch(() => console.error('Error writing document: ', Error));;
    }
    else if (tripDirection == "o") {
      this.db
        .collection('visits')
        .doc(docRef)
        .update({ "outwardConfirmed": true })
        .then(() => this.router.navigate(['stationBook']))
        .catch(() => console.error('Error writing document: ', Error));;
    }
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
    returnValue.boarding = this.combineTime(info.inward.boarding, info.inward.boardingTime);
    if (typeof info.ownInwardTrip !== 'undefined') {
      returnValue.boarding = this.combineTime(info.inward.boarding, info.inward.boardingTime)
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
    returnValue.boarding = this.combineTime(info.outward.boarding, info.outward.boardingTime)
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
      case 'Awaiting Berth': {
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
        console.log(info.inward.boarding)
        return info.outward.boarding;
      }
      default: {
        info.berth = info.outward.port;
        return info.eta;
      }
    }
  }

  combineTime(eta, etaTime) {
    // takes in a eta: moment and etaTime: Date and returns a date 
    if (eta !== null) {
      if (etaTime !== null) {
        let fulleta: moment.Moment = moment(eta);
        fulleta.hour(etaTime.getHours());
        fulleta.minute(etaTime.getMinutes());
        return fulleta.toDate();
      }
      else {
        let fulleta: moment.Moment = moment(eta);
        fulleta.hour(12);
        fulleta.minute(0);
        return fulleta.toDate();
      }
    }
    else {
      return eta
    }
  }

  changecurrentVisit(visit: Visit) {
    this.currentVisitSource.next(visit);
  }

  getColor(status) {
    switch (status) {
      case 'Due':
        return '#e6ffe6';
      case 'Awaiting Berth':
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

  cancelSubscriptions() {
    this.fbSubs.forEach(sub => sub.unsubscribe);
  }

  ngOnDestroy() {
    this.cancelSubscriptions();
  }
}
