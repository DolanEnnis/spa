import { Component, OnInit, OnDestroy } from '@angular/core';
/* import {
  FormGroup,
  Validators,
  FormBuilder,
} from '@angular/forms'; */
import { Location, formatDate } from '@angular/common';
import { Subscription, Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from 'angularfire2/firestore';
import { VisitService } from '../services/visit.service';
import { AuthService } from '../auth/auth.service';
import { Patron } from '../shared/patron.model';
import { Charge } from '../shared/submittedTrip.model';
import { RatesService } from '../services/rates.service';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.css']
})
export class ConfirmComponent implements OnInit, OnDestroy {
  id: string;
  visitdocId: string;
  visitDoc: AngularFirestoreDocument<Charge>;
  subscription: Subscription;
  public updated = new Date();
  public updatedBy;
  private patron: Patron;
  //tripForm: FormGroup;
  trip: Charge = { ship: "" };
  // ship: string;
  ownTrip: boolean;
  tripDirection: string;
  public confirmed: boolean;




  constructor(
    //private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    //private db: AngularFirestore,
    private visitService: VisitService,
    private authService: AuthService,
    private _location: Location,
    private ratesService: RatesService,
  ) {
    this.id = this.route.snapshot.params['id'];
    this.tripDirection = this.id[this.id.length - 1];
    this.visitdocId = this.id.substring(0, this.id.length - 1);
  }

  ngOnInit() {
    this.patron = this.authService.getUser();
    this.subscription = this.visitService.currentVisit$.subscribe(d => {

      this.trip.ship = d.ship;
      this.trip.gt = d.gt;
      if (this.tripDirection == 'i') {
        //INWARD TRIP
        this.trip.boarding = this.visitService.getBoarded(d.inward.boarding);
        this.trip.typeTrip = "Inward";
        this.trip.extra = d.inward.extra;
        this.trip.pilot = d.inward.pilot;
        this.trip.port = d.inward.port;
        this.confirmed = d.inwardConfirmed;
      }
      else {
        //OUTWARD TRIP
        this.trip.boarding = this.visitService.getBoarded(d.outward.boarding);
        this.trip.typeTrip = "Outward";
        this.trip.extra = d.outward.extra;
        this.trip.note = d.outward.note;
        this.trip.pilot = d.outward.pilot;
        this.trip.port = d.outward.port;
        this.confirmed = d.outwardConfirmed;
      }
      this.trip.berthing = this.ratesService.berthing(this.trip.gt, this.trip.port);
      this.trip.pilotageCharge = this.ratesService.pilotCharge(this.trip.gt, this.trip.port);
      this.trip.incidental = this.ratesService.incidental;
      this.trip.travel = this.ratesService.travel;
    });
    this.ownTrip = (this.trip.pilot == this.patron.displayName ||
      this.patron.displayName == "Brian");
    // allows Admin "BD" confirm all ships!
  }


  confirm() {
    console.log("We will confirm all " + this.tripDirection);

    this.visitService.updateConfirmed(this.visitdocId, this.tripDirection, this.trip);
  }

  goBack() {
    this._location.back();
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
