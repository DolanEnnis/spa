import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';

import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { DateTimeAdapter } from 'ng-pick-datetime';

import { VisitService } from '../shared/visit.service';
import { ValidateUrl } from '../shared/marineTraffic.validator';
import { Router } from '@angular/router';

import { Visit } from '../shared/visit.model'
/* import { MomentModule } from 'angular2-moment';
import * as moment from 'moment'; */

@Component({
  selector: 'app-new-visit',
  templateUrl: './new-visit.component.html',
  styleUrls: ['./new-visit.component.css']
})
export class NewVisitComponent implements OnInit, AfterViewInit, OnDestroy {
  newShipForm: FormGroup;
  public now = new Date();


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

  updates = [
    { value: 'Sheet', viewValue: 'Sheet' },
    { value: 'AIS', viewValue: 'AIS' },
    { value: 'Good Guess', viewValue: 'Good Guess' },
    { value: 'Agent', viewValue: 'Agent' },
    { value: 'Pilot', viewValue: 'Pilot' },
    { value: 'Other', viewValue: 'Other' },
  ];

  displayedColumns = ['eta', 'ship', 'gt', 'port'];
  dataSource = new MatTableDataSource<Visit>();
  private tpChangedSubscription: Subscription;
  private vesselSubscription: Subscription
  ship: string;
  error: string;
  private reg: string = '[https://www.marinetraffic.com/en/ais/details/ships/shipid]';

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private visitService: VisitService,
    dateTimeAdapter: DateTimeAdapter<any>,
    private router: Router) {
    dateTimeAdapter.setLocale('en-GB');
  }

  ngOnInit() {
    this.now.setMinutes(0)
    this.newShipForm = new FormGroup({
      ship: new FormControl('', { validators: [Validators.required] }),
      eta: new FormControl(this.now, { validators: [Validators.required] }),
      gt: new FormControl('', { validators: [Validators.required] }),
      port: new FormControl('', { validators: [Validators.required] }),
      shipNote: new FormControl(''),
      marineTraffic: new FormControl('', { validators: [ValidateUrl] }),
      update: new FormControl('', { validators: [Validators.required] }),
    });
    this.tpChangedSubscription = this.visitService.allTripsChanged.subscribe(
      (visits: Visit[]) => {
        this.dataSource.data = visits;
      });
    this.visitService.fetchVisits();
  }



  onSubmit() {
    this.visitService.setNewVisit(this.newShipForm.value);
    this.newShipForm.markAsPristine();
    this.router.navigate(['/']);
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  doFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  handleRowClick(row) {
    this.newShipForm.patchValue(
      {
        'ship': row.ship,
        'gt': row.gt,
        'shipNote': row.shipNote,
        'marineTraffic': row.marineTraffic,
      }
    )
  }

  ngOnDestroy() {
    if (this.tpChangedSubscription) { this.tpChangedSubscription.unsubscribe() };
    if (this.vesselSubscription) { this.vesselSubscription.unsubscribe(); }
  }

}





