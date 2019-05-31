import { Component, Output, EventEmitter, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Trip } from '../shared/trip.model';

@Component({
  selector: 'app-trip-info-own',
  templateUrl: './trip-info-own.component.html',
  styleUrls: ['./trip-info-own.component.css'],
})
export class TripInfoOwnComponent implements OnInit {
  @Output() formReady = new EventEmitter<FormGroup>();
  @Output() confirming = new EventEmitter<string>();
  @Input() trip: Trip;
  @Input() visitdocId: String;
  ownTripForm: FormGroup;
  briansShip: boolean = false;


  constructor(private fb: FormBuilder,
    private router: Router, ) { }

  ngOnInit() {
    this.ownTripForm = this.fb.group({
      pilotNotes: [this.trip.pilotNotes],
      pilotNo: [this.trip.pilotNo],
      timeOff: [this.getTime(this.trip.timeOff)],
      monthNo: [this.trip.monthNo],
      car: [this.trip.car],
      good: [this.trip.good, [Validators.min(1), Validators.max(6)]],
      confirmed: [this.trip.confirmed],
      extra: [this.trip.extra],
    });
    this.briansShip = this.trip.pilot == "Brian";
    this.formReady.emit(this.ownTripForm);

  }

  getTime(time) {
    //this is copy of code in trip-info.components maybe move both to visit service?
    if (time === null || typeof time === 'undefined') {
      return time;
    } else {
      return time.toDate();
    }
  }


  confirm(): void {
    this.confirming.emit(this.trip.typeTrip);


  }
}
