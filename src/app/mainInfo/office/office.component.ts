import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Subject, Observable } from 'rxjs';


import { Visit } from '../../shared/visit.model'

@Component({
  selector: 'app-office',
  templateUrl: './office.component.html',
  styleUrls: ['./office.component.css']
})
export class OfficeComponent implements OnInit {
  tablists: any[];
  allTripsChanged = new Subject<Visit[]>();
  tripsDue$: Observable<any[]>;
  tripsWaiting$: Observable<any[]>;
  tripsAlongside$: Observable<any[]>;

  constructor(private db: AngularFirestore) {
    this.tablists = ['Aughinish', 'Foynes', 'Limerick', 'Shannon', 'Moneypoint', 'Tarbert']
  }

  ngOnInit() {
    this.tripsDue$ = (this.db.collection('visits', ref =>
      ref.where('status', '==', "Due"))
      .valueChanges());
    this.tripsWaiting$ = (this.db.collection('visits', ref =>
      ref.where('status', '==', "Waiting Berth"))
      .valueChanges());
    this.tripsAlongside$ = (this.db.collection('visits', ref =>
      ref.where('status', '==', "Alongside"))
      .valueChanges());
  }

}




