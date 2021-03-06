// This shows the "Previous" Page

import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
//import { MatPaginator } from '@angular/material/paginator';
//import { MatSort } from '@angular/material/sort';
import { Subscription } from 'rxjs';

import { VisitService } from '../services/visit.service';
import { Visit } from '../shared/visit.model'
import { ViewInfo } from '../shared/view.model'
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-all-ships',
  templateUrl: './all-ships.component.html',
  styleUrls: ['./all-ships.component.css']
})
export class AllShipsComponent implements OnInit, OnDestroy {

  dataSourceIn = new MatTableDataSource<ViewInfo>();
  dataSourceOut = new MatTableDataSource<ViewInfo>();
  private tpChangedSubscription: Subscription;
  in: string;
  out: string;
  message: string; //Who is logged on?
  isUserPilot: boolean;
  pilots = ['Fergal', 'Brian', 'Peter', 'Fintan', 'Mark', 'Dave', 'Paddy', 'Cyril']

  constructor(
    private visitService: VisitService,
    private data: DataService
  ) { }


  ngOnInit() {
    this.data.currentMessage.subscribe(message => this.message = message);
    (async () => {
      await this.delay(500);
      // delay so message is filled!
    })();
    this.out = "out";
    this.in = "in";
    this.tpChangedSubscription = this.visitService.allTripsChanged.subscribe(
      (visits: Visit[]) => {
        const inwardInfo: ViewInfo[] = visits
          .map(visit => {
            return {
              visit: visit,
              ship: visit.ship,
              pilot: visit.inward.pilot,
              gt: visit.gt,
              status: visit.status,
              berth: visit.inward.port,
              boarded: this.visitService.getBoarded(visit.eta),
              docid: visit.docid,
              confirmed: visit.inwardConfirmed,
            }
          });
        const outwardInfo: ViewInfo[] = visits
          .map(visit => {
            return {
              visit: visit,
              ship: visit.ship,
              pilot: visit.outward.pilot,
              gt: visit.gt,
              status: visit.status,
              berth: visit.outward.port,
              boarded: this.visitService.getBoarded(visit.outward.boarding),
              docid: visit.docid,
              confirmed: visit.outwardConfirmed,
            };
          });
        this.dataSourceIn.data = inwardInfo;
        this.dataSourceOut.data = outwardInfo
          .filter(e => e.boarded < this.visitService.today).sort(function (a, b) {
            return (b.boarded) - (a.boarded);
          }
          );
        //filter out all outward ships without boarding time
      });
    this.visitService.fetchVisits();
    // find out if user is pilot
    this.isUserPilot = (this.pilots.includes(this.message))
  }

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  ngOnDestroy() {
    if (this.tpChangedSubscription) { this.tpChangedSubscription.unsubscribe(); }
  }

}
