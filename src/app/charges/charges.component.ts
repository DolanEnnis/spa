import { Component, OnInit, OnDestroy } from '@angular/core';

import Tabulator from 'tabulator-tables';
import { Subscription } from 'rxjs';
import { Subject } from 'rxjs/Subject';
import { AngularFirestore } from 'angularfire2/firestore';

import * as _moment from 'moment';
const moment = _moment;

import { ChargesService } from '../services/charges.service';
import { Charge } from '../shared/submittedTrip.model';


@Component({
  selector: 'app-charges',
  templateUrl: './charges.component.html',
  styleUrls: ['./charges.component.css']
})
export class ChargesComponent implements OnInit, OnDestroy {

  private fbSubs: Subscription[] = [];
  private tpChangedSubscription: Subscription;
  allChargesChanged = new Subject<Charge[]>();

  columnNames: any[] = [];
  myTable: Tabulator;

  constructor(private chargeService: ChargesService,
    private db: AngularFirestore,
  ) { }


  ngOnInit() {
    this.myTable = new Tabulator("#tabulator-div");
    this.columnNames = [
      { title: "Timestamp", field: "updateTime" },
      { title: "Ship", field: "ship" },
      { title: "GT", field: "gt" },
      { title: "Date", field: "boarding" },
      { title: "In / Out", field: "typeTrip" },
      { title: "To/From", field: "port" },
      { title: "Extra Services", field: "extra" },
      { title: "Pilot", field: "pilot" },
      { title: "Comment on Ship", field: "note" },
    ];
    this.myTable.setColumns(this.columnNames);

    this.tpChangedSubscription = this.allChargesChanged.subscribe(
      (charges: Charge[]) => {
        for (let i = 0; i < charges.length; i++) {
          charges[i].updateTime = moment(charges[i].updateTime).format("DD/MM/YYYY");
          charges[i].boarding = moment(charges[i].boarding * 1000).format("DD/MM/YYYY")
        }
        this.myTable.setData(charges);
        this.myTable.setSort([
          { column: "boarding", dir: "asc", sorter: "date", }, //sort by this first
          { column: "ship", dir: "asc" }, //then sort by this second
        ]);
      });
    this.fetchVisits()
  }


  fetchVisits() {
    this.fbSubs.push(this.db.collection('charges')
      .valueChanges()
      .subscribe((charges: Charge[]) => {
        this.allChargesChanged.next(charges);
      }, error => {
        console.log("The error is in fetchVisits!");
        console.log(error);
      }));
  }



  download() {
    this.myTable.download("csv", "chargedata.csv");
  }


  ngOnDestroy() {
    if (this.tpChangedSubscription) { this.tpChangedSubscription.unsubscribe(); }
  }
}
