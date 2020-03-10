import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { Location } from '@angular/common';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
  NgForm,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from 'angularfire2/firestore';

import { VisitService } from '../services/visit.service';
import { Visit } from '../shared/visit.model';
import { Subscription, Observable } from 'rxjs';
import { DateTimeAdapter } from 'ng-pick-datetime';
import { Trip } from '../shared/trip.model';
import { AuthService } from '../auth/auth.service';
import { Patron } from '../shared/patron.model';
import { ValidateUrl } from '../shared/marineTraffic.validator';

import * as _moment from 'moment';
import { Charge } from '../shared/submittedTrip.model';
import { DataService } from '../services/data.service';
//import { toDate } from '@angular/common/src/i18n/format_date';
const moment = _moment;

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css'],
})
export class DetailComponent implements OnInit, OnDestroy {
  visitdocId: string;
  visitDoc: AngularFirestoreDocument<Visit>;
  currentVisit: Observable<any>;
  private subs: Subscription[] = [];
  //subscription: Subscription;
  shipForm: FormGroup;
  public updated = new Date();
  public updatedBy;
  public status;
  inward: Trip;
  outward: Trip;
  statusColor: string;
  ownInwardTrip: boolean;
  ownOutwardTrip: boolean;
  private patron: Patron;
  public flagDue: boolean = false;
  public inConfirmed: boolean;
  public outConfirmed: boolean;
  trip: Charge;


  public eta = moment();//for testing only
  updates = [
    { value: 'Sheet', viewValue: 'Sheet' },
    { value: 'AIS', viewValue: 'AIS' },
    { value: 'Good Guess', viewValue: 'Good Guess' },
    { value: 'Agent', viewValue: 'Agent' },
    { value: 'Pilot', viewValue: 'Pilot' },
    { value: 'Other', viewValue: 'Other' },
  ];

  statuss = [
    { value: 'Due', viewValue: 'Due' },
    { value: 'Awaiting Berth', viewValue: 'Awaiting Berth' },
    { value: 'Alongside', viewValue: 'Alongside' },
    { value: 'Sailed', viewValue: 'Sailed' },
  ]; //statuss spelt wrong because what is plural of status?

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private visitService: VisitService,
    private authService: AuthService,
    private data: DataService,
    private _location: Location,
    dateTimeAdapter: DateTimeAdapter<any>
  ) {
    dateTimeAdapter.setLocale('en-GB');
    this.visitdocId = this.route.snapshot.params['id'];
    this.subs.push(
      this.data.currentTrip.subscribe(trip => (this.trip = trip))
    );
  }

  ngOnInit() {
    this.patron = this.authService.getUser();
    this.subs.push(
      this.visitService.currentVisit$.subscribe(d => {
        this.shipForm = this.fb.group({
          ship: [d.ship, [Validators.required]],
          eta: [((d.eta.toDate())), [Validators.required]],
          etaTime: [d.eta.toDate()],
          gt: [
            d.gt,
            [Validators.required, Validators.min(50), Validators.max(200000)],
          ],
          marineTraffic: [d.marineTraffic, ({ validators: [ValidateUrl] })],
          shipNote: d.shipNote,
          status: [d.status, [Validators.required]],
          update: [d.update, [Validators.required]],
        });
        this.inward = d.inward;
        this.outward = d.outward;
        this.updated = d.updateTime;
        this.updatedBy = d.updatedBy;
        this.status = d.status;
        this.inConfirmed = d.inwardConfirmed;
        this.outConfirmed = d.outwardConfirmed;
      }));
    this.setFlag();
    this.statusColor = this.getColor();
    this.setOwnTrips();
  }

  formInitialized(name: string, form: FormGroup) {
    this.shipForm.setControl(name, form);
  }

  onSubmit() {
    this.submitting();
    this._location.back();
  }

  confirmIn(event) {
    this.submitting();
    const info = this.shipForm.value;
    this.trip.boarding = (info.inward.boarding);
    this.trip.typeTrip = "In";
    this.trip.extra = info.inward.extra;
    this.trip.pilot = info.inward.pilot;
    this.trip.port = info.inward.port;
    this.trip.confirmed = this.inConfirmed;
    this.router.navigate(['confirm', this.visitdocId + 'i']);
    console.log(this.trip)
  }

  confirmOut(event) {
    this.submitting();
    const info = this.shipForm.value;
    this.trip.boarding = (info.outward.boarding);
    if (this.trip.boarding == null) { }
    this.trip.typeTrip = "Out";
    this.trip.extra = info.outward.extra;
    this.trip.pilot = info.outward.pilot;
    this.trip.port = info.outward.port;
    this.trip.confirmed = this.outConfirmed;
    this.router.navigate(['confirm', this.visitdocId + 'o']);
  }

  submitting() {
    const info = this.shipForm.value;
    this.trip.ship = info.ship;
    this.trip.gt = info.gt;
    this.visitService.updateVisit(info, this.visitdocId);
    this.shipForm.markAsPristine();
  }

  getColor() {
    return this.visitService.getColor(this.status);
  }

  changeStatus(event) {
    this.status = event.value;
    this.statusColor = this.visitService.getColor(event.value);
    this.setFlag()
  }

  changeEta(event) {
    this.setFlag()
  }

  setFlag() {
    var newEta = this.visitService.combineTime(this.shipForm.value.eta, this.shipForm.value.etaTime)
    if (this.shipForm.value.status === "Due" && newEta.valueOf() / 1000 < this.visitService.today) {
      this.flagDue = true
    }
    else {
      this.flagDue = false
    }
  }

  pilotDiff(event, tripType) {
    if (tripType == "inward") {
      this.inward.pilot = event.value
    }
    if (tripType == "outward") {
      this.outward.pilot = event.value
    }
    this.setOwnTrips();
  }
  setOwnTrips() {
    //Sets properties to boolean if user and trip pilot are same!
    this.ownInwardTrip = this.inward.pilot == this.patron.displayName ||
      (this.inward.pilot == "Fergal" && this.patron.displayName == "Brian");
    this.ownOutwardTrip = this.outward.pilot == this.patron.displayName ||
      (this.outward.pilot == "Fergal" && this.patron.displayName == "Brian");;
  }


  ngOnDestroy() {
    this.subs.forEach(sub => sub.unsubscribe);
  }
}
