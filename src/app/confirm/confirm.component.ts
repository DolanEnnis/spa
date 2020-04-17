import { Component, OnInit, OnDestroy } from '@angular/core';
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
import { DataService } from '../services/data.service';
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
  private subs: Subscription[] = [];
  subscription: Subscription;
  public updated = new Date();
  public updatedBy;
  private patron: Patron;
  trip: Charge = { ship: "" };
  ownTrip: boolean;
  tripDirection: string;
  dateError: boolean;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private visitService: VisitService,
    private authService: AuthService,
    private _location: Location,
    private ratesService: RatesService,
    private data: DataService,
  ) {
    this.id = this.route.snapshot.params['id'];
    this.tripDirection = this.id[this.id.length - 1];
    this.visitdocId = this.id.substring(0, this.id.length - 1);
    this.subs.push(
      this.data.currentTrip.subscribe(trip => (this.trip = trip))
    );
  }

  ngOnInit() {
    console.log(this.trip.boarding)
    this.patron = this.authService.getUser();
    this.trip.berthing = this.ratesService.berthing(this.trip.gt, this.trip.port);
    this.trip.pilotageCharge = this.ratesService.pilotCharge(this.trip.gt, this.trip.port);
    this.trip.incidental = this.ratesService.incidental;
    this.trip.travel = this.ratesService.travel;
    this.trip.updateTime = Date.now();
    this.ownTrip = (this.trip.pilot == this.patron.displayName ||
      this.patron.displayName == "Brian");
    // allows Admin "BD" confirm all ships!
    this.dateError = ((this.trip.boarding) > this.trip.updateTime)
    //gives an error if the boarding is in the future!
  }


  confirm() {
    this.trip.confirmed = true;
    this.visitService.updateConfirmed(this.visitdocId, this.tripDirection, this.trip);
  }

  goBack() {
    this._location.back();
  }

  ngOnDestroy() {
    this.subs.forEach(sub => sub.unsubscribe);
  }
}
