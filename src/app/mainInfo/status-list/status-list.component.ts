import { Component, Output, EventEmitter, ViewChild, Input, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { MatTableDataSource, MatSort } from '@angular/material';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Subject } from 'rxjs/Subject';

import { VisitService } from '../../services/visit.service';
import { Visit } from '../../shared/visit.model'
/* import { AuthService } from '../../auth/auth.service';
import { DataService } from "../../shared/data.service"; */

@Component({
  selector: 'app-status-list',
  templateUrl: './status-list.component.html',
  styleUrls: ['./status-list.component.css']
})
export class StatusListComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input('status') status: string;
  @Input('et') et: string;
  private fbSubs: Subscription[] = [];
  allTripsChanged = new Subject<Visit[]>();
  displayedColumns = ['ship', 'officeTime', 'port', 'note', 'pilot', 'updated', 'mt'];
  dataSource = new MatTableDataSource<Visit>();
  //myVisits: [any];
  private tpChangedSubscription: Subscription;
  private loggedinUserID: any;
  //private today = this.visitService.today


  @ViewChild(MatSort, { static: false }) sort: MatSort;

  constructor(private visitService: VisitService,
    private router: Router,
    private db: AngularFirestore,
    // private dataService: DataService
  ) { }


  ngOnInit() {
    this.tpChangedSubscription = this.allTripsChanged.subscribe(
      (visits: Visit[]) => {
        for (let i = 0; i < visits.length; i++) {
          //this.visitService.getUserData((visits[i].updateUser))
          if (visits[i].status == "Alongside") {
            visits[i].berth = visits[i].outward.port
            visits[i].note = visits[i].outward.note
            visits[i].pilot = visits[i].outward.pilot
          }
          else {
            visits[i].berth = visits[i].inward.port
            visits[i].note = visits[i].inward.note
            visits[i].pilot = visits[i].inward.pilot
          }
          if (!visits[i].officeTime) {
            visits[i].officeTime = "No Info"
          }
        }
        this.dataSource.data = visits;
      });
    this.fetchVisits();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  fetchVisits() {
    this.fbSubs.push(this.db.collection('visits', ref =>
      ref.where('status', '==', this.status))
      .valueChanges()
      .subscribe((visits: Visit[]) => {
        this.allTripsChanged.next(visits);
      }, error => {
        console.log("The error is in fetchVisits!");
        console.log(error);
      }));
  }


  handleRowClick(row) {
    this.visitService.changecurrentVisit(row);
    this.router.navigate(['edit', row.docid]);
  }

  ngOnDestroy() {
    if (this.tpChangedSubscription) { this.tpChangedSubscription.unsubscribe(); }
  }

}
