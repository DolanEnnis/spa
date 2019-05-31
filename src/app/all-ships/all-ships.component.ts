// This shows the "Previous" Page

import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { now } from 'moment';

//import { AngularFirestore } from 'angularfire2/firestore';
//import { Subject } from 'rxjs/Subject';


import { VisitService } from '../shared/visit.service';
import { Visit } from '../shared/visit.model'
import { ViewInfo } from '../shared/view.model'
import { DataService } from '../shared/data.service';

@Component({
  selector: 'app-all-ships',
  templateUrl: './all-ships.component.html',
  styleUrls: ['./all-ships.component.css']
})
export class AllShipsComponent implements OnInit, OnDestroy {

  dataSourceIn = new MatTableDataSource<ViewInfo>();
  dataSourceOut = new MatTableDataSource<ViewInfo>();
  private tpChangedSubscription: Subscription;
  //private today: number;
  in: string;
  out: string;
  message: string; //Who is logged on?

  //private loggedinUserID: string;


  constructor(
    private visitService: VisitService,
    private data: DataService
    // private router: Router
  ) { }


  ngOnInit() {
    this.data.currentMessage.subscribe(message => this.message = message);
    (async () => {
      await this.delay(500);
      // delay so message is filled!
    })();
    this.out = "out";
    this.in = "in";
    //this.today = now() / 1000;
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
  }

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  ngOnDestroy() {
    if (this.tpChangedSubscription) { this.tpChangedSubscription.unsubscribe(); }
  }

}
