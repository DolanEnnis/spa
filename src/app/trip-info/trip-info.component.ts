
/* Goes into Detail Page twice for inward and outward trips */

import { Component, Output, EventEmitter, Input, OnInit, OnChanges, SimpleChange } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Trip } from '../shared/trip.model';
import { VisitService } from '../services/visit.service';
import * as moment from 'moment';


@Component({
  selector: 'app-trip-info',
  templateUrl: './trip-info.component.html',
  styleUrls: ['./trip-info.component.css']
})
export class TripInfoComponent implements OnInit, OnChanges {
  @Output() formReady = new EventEmitter<FormGroup>();
  @Output() onNewPilot = new EventEmitter();
  @Input() trip: Trip;
  @Input() status: string;
  tripForm: FormGroup;
  startAtHour = new Date();



  typeTrips = [
    { value: 'In', viewValue: 'In' },
    { value: 'Out', viewValue: 'Out' },
    { value: 'anchoring', viewValue: 'Anchoring' },
    { value: 'berthToBerth', viewValue: 'Berth To Berth' },
    { value: 'other', viewValue: 'Other' },
  ];

  ports = [
    { value: 'Anchorage', viewValue: 'Anchorage' },
    { value: 'Cappa', viewValue: 'Cappa' },
    { value: 'Moneypoint', viewValue: 'Moneypoint' },
    { value: 'Tarbert', viewValue: 'Tarbert' },
    { value: 'Foynes', viewValue: 'Foynes' },
    { value: 'Aughinish', viewValue: 'Aughinish' },
    { value: 'Shannon', viewValue: 'Shannon' },
    { value: 'Limerick', viewValue: 'Limerick' }
  ];

  pilots = [
    { value: 'Fergal', viewValue: 'Fergal' },
    { value: 'Brian', viewValue: 'Brian' },
    { value: 'Peter', viewValue: 'Peter' },
    { value: 'Fintan', viewValue: 'Fintan' },
    { value: 'Mark', viewValue: 'Mark' },
    { value: 'Dave', viewValue: 'Dave' },
    { value: 'Paddy', viewValue: 'Paddy' },
    { value: 'Cyril', viewValue: 'Cyril' },
    { value: null, viewValue: null },
  ]
  flag: boolean = false;
  boarding: moment.Moment;

  constructor(private fb: FormBuilder,
    private visitService: VisitService, ) { }

  ngOnInit() {
    this.tripForm = this.fb.group({
      typeTrip: [this.trip.typeTrip],
      extra: [this.trip.extra],
      note: [this.trip.note],
      boarding: [this.getBoarding(this.trip.boarding)],
      boardingTime: [this.getBoarding(this.trip.boarding)],
      pilot: [this.trip.pilot],
      port: [this.trip.port],
    });
    this.boarding = moment(this.getBoarding(this.trip.boarding))
    this.formReady.emit(this.tripForm);
  }

  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    if (this.boarding) { console.log(this.boarding.inspect()) }
    this.setFlag(this.boarding, this.status)
  }

  getBoarding(boarding) {
    if (boarding === null) {
      this.startAtHour.setMinutes(0)
      return boarding;
    }
    else {
      this.startAtHour = boarding.toDate();
      return boarding.toDate();
    }
  }

  setupFlag(event) {
    this.boarding = moment(event.value),
      this.setFlag(this.boarding, this.status)
  }

  setFlag(boarding: moment.Moment, status: string) {
    if (boarding) {
      if ((boarding).isBefore(moment.now())) {
        if ((status == "Awaiting Berth" && this.trip.typeTrip == "In") ||
          (status == "Alongside" && this.trip.typeTrip == "Out")) {
          this.flag = true
        }
        else { this.flag = false }
      }
      else { this.flag = false }
    }
  }


  changeTime(event) {
    if ((!this.tripForm.value.boarding) || (!this.tripForm.value.boardingTime)) {
      this.flag = false //Red warning does not come up until both date and time set!
    }
    else {
      var newTime = this.visitService.combineTime(this.tripForm.value.boarding, this.tripForm.value.boardingTime)
      this.setFlag(moment(newTime), this.status)
    }
  }

  changePilot(event) {
    this.onNewPilot.emit(event)
  }
}
