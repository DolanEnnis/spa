import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  FormGroup,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { Location, formatDate } from '@angular/common';
import { Subscription, Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from 'angularfire2/firestore';
import { VisitService } from '../shared/visit.service';
import { AuthService } from '../auth/auth.service';
import { Patron } from '../shared/patron.model';
import { submittedTrip } from '../shared/submittedTrip.model';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.css']
})
export class ConfirmComponent implements OnInit, OnDestroy {
  visitdocId: string;
  visitDoc: AngularFirestoreDocument<submittedTrip>;
  subscription: Subscription;
  public updated = new Date();
  public updatedBy;
  private patron: Patron;
  tripForm: FormGroup;
  trip: submittedTrip = { ship: "" };
  // ship: string;
  ownTrip: boolean;
  tripDirection: string;



  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    //private db: AngularFirestore,
    private visitService: VisitService,
    private authService: AuthService,
    private _location: Location,
  ) {
    this.visitdocId = this.route.snapshot.params['id'];
    this.tripDirection = this.visitdocId[this.visitdocId.length - 1];
  }

  ngOnInit() {
    this.patron = this.authService.getUser();
    this.subscription = this.visitService.currentVisit$.subscribe(d => {

      this.trip.ship = d.ship;
      this.trip.gt = d.gt;
      if (this.tripDirection == 'i') {
        //INWARD TRIP
        this.trip.boarding = this.visitService.getBoarded(d.inward.boarding);
        this.trip.typeTrip = "inward";
        this.trip.extra = d.inward.extra;
        this.trip.pilot = d.inward.pilot;
        this.trip.port = d.inward.port;
      }
      else {
        //OUTWARD TRIP
        this.trip.boarding = this.visitService.getBoarded(d.outward.boarding);
        this.trip.typeTrip = "outward";
        this.trip.extra = d.outward.extra;
        this.trip.note = d.outward.note;
        this.trip.pilot = d.outward.pilot;
        this.trip.port = d.outward.port;
      }
      console.log("hi2" + this.trip.port)
      this.trip.berthing = this.berthing(this.trip.gt, this.trip.port);
      this.trip.pilotageCharge = this.pilotCharge(this.trip.gt, this.trip.port);
      this.trip.incidental = 8.37;
      this.trip.travel = 114.46;
    });
    this.ownTrip = (this.trip.pilot == this.patron.displayName);
  }

  pilotCharge(gt, port) {
    // Pilot Rates
    const cappa = 83.53;
    const mpMin = 379.10;
    const mprate = 0.0491;
    let charge: number;
    switch (port) {
      case 'Anchorage':
        charge = 0;
        break;
      case 'Cappa':
        charge = cappa;
        break;
      case 'Moneypoint':
        charge = mprate * gt;
        if (charge < mpMin) { charge = mpMin }
        break;
    }
    return charge;
  }
  /*  'Moneypoint' | 'Tarbert' | 'Foynes' | 'Aughinish' | 'Shannon' | 'Limerick' */

  berthing(gt: number, port: string) {
    console.log("hi" + port)
    let berthing: number;
    if (port == "Anchorage") {

      if (gt > 85000) {
        berthing = 273.27
      }
      else if (gt > 65000) {
        berthing = 248.62
      }
      else if (gt > 50000) {
        berthing = 227.91
      }
      else if (gt > 35000) {
        berthing = 207.18
      }
      else if (gt > 25000) {
        berthing = 186.46
      }
      else if (gt > 16000) {
        berthing = 165.74
      }
      else if (gt > 8000) {
        berthing = 145.07
      }
      else {
        berthing = 82.86
      }
    }
    else {
      if (gt > 100000) {
        berthing = 269.71
      }
      else if (gt > 70000) {
        berthing = 248.62
      }
      else if (gt > 60000) {
        berthing = 198.89
      }
      else if (gt > 50000) {
        berthing = 151.23
      }
      else if (gt > 30000) {
        berthing = 122.23
      }
      else if (gt > 15000) {
        berthing = 87.01
      }
      else if (gt > 5000) {
        berthing = 58
      }
      else if (gt > 1500 || port == 'Foynes') {
        berthing = 38.33
      }
      else {
        berthing = 29
      }
    }
    return berthing
  }

  formInitialized(name: string, form: FormGroup) {
    this.tripForm.setControl(name, form);
  }


  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
