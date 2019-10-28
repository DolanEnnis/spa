import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { Router } from '@angular/router';

import { VisitService } from '../../services/visit.service';
import { Visit } from '../../shared/visit.model';
import { AuthService } from '../../auth/auth.service';
import { Patron } from '../../shared/patron.model';
import { ViewInfo } from '../../shared/view.model'
//import { now } from 'moment';
//import { Timestamp } from 'rxjs/internal/operators/timestamp';

@Component({
  selector: 'app-pilot',
  templateUrl: './pilot.component.html',
  styleUrls: ['./pilot.component.css'],
})
export class PilotComponent implements OnInit, AfterViewInit, OnDestroy {
  displayedColumns = [
    'boarded',
    'ship',
    'gt',
    'berth',
    'monthNo',
    'no',
    'confirmed',
    'inout',
  ];

  dataSource = new MatTableDataSource<ViewInfo>();
  private tpChangedSubscription: Subscription;
  private loggedinUserID: string;
  private patron: Patron;
  // private pilotVisit: any;
  private today: number;

  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  constructor(
    private visitService: VisitService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.today = this.visitService.today;
    this.patron = this.authService.getUser();
    this.tpChangedSubscription = this.visitService.allTripsChanged.subscribe(
      (visits: Visit[]) => {
        const inwardInfo: ViewInfo[] = visits
          .filter(element => element.inward.pilot == this.patron.displayName)
          .map(visit => {
            return {
              visit: visit,
              ship: visit.ship,
              pilot: visit.inward.pilot,
              gt: visit.gt,
              status: visit.status,
              berth: visit.inward.port,
              boarded: this.visitService.getBoarded(visit.inward.boarding),
              monthNo: visit.inward.monthNo,
              no: visit.inward.pilotNo,
              docid: visit.docid,
              confirmed: visit.inwardConfirmed,
              inout: 'in',
            };
          });
        const outwardInfo: ViewInfo[] = visits
          .filter(element => element.outward.pilot == this.patron.displayName)
          .map(visit => {
            return {
              visit: visit,
              ship: visit.ship,
              pilot: visit.outward.pilot,
              gt: visit.gt,
              status: visit.status,
              berth: visit.outward.port,
              boarded: this.visitService.getBoarded(visit.outward.boarding),
              monthNo: visit.outward.monthNo,
              no: visit.outward.pilotNo,
              docid: visit.docid,
              confirmed: visit.outwardConfirmed,
              inout: 'out',
            };
          });
        this.dataSource.data = inwardInfo.concat(outwardInfo);
      }
    );
    this.visitService.fetchVisits();
    this.loggedinUserID = this.visitService.getUseruid();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  doFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getColor(row) {
    switch (row.inout) {
      case 'in':
        return '#eff2f7';
      default:
        return '#f9e8e8';
    }
  }

  /*   getTextColor(row: Visit) {
      return 'Red';
    } */

  /*   getBoarded(boarding, eta) {
      if (boarding == null) {
        const sudoDate = Date.now() + 946080000; //If a boarding date is not fixed this makes a date 30 odd year in the future
        return sudoDate;
      }
      return boarding.seconds;
    } */

  handleRowClick(row: ViewInfo) {
    this.visitService.changecurrentVisit(row.visit);
    this.router.navigate(['edit', row.docid]);
  }

  ngOnDestroy() {
    if (this.tpChangedSubscription) {
      this.tpChangedSubscription.unsubscribe();
    }
  }
}


