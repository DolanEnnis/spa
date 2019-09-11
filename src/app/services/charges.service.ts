import { Injectable, OnInit, OnDestroy } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from 'angularfire2/firestore';


import { Subject, Observable, Subscription, BehaviorSubject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { Charge } from '../shared/submittedTrip.model';

@Injectable()
export class ChargesService implements OnDestroy {

  private fbSubs: Subscription[] = []; //List of subscriptions to Firebase
  allChargesChanged = new Subject<Charge[]>();

  constructor(
    private db: AngularFirestore,
  ) { }

  fetchCharges() {
    this.fbSubs.push(
      this.db
        .collection('charges')
        .valueChanges()
        .subscribe(
          (charges: Charge[]) => {
            this.allChargesChanged.next(charges);
          },
          error => {
            console.log('The error is in fetchVisits!');
            console.log(error);
          }
        )
    );
  }

  private addChargeToDatabase(charge: Charge) {
    this.db
      .collection('charges')
      .add(charge)
      .then(docRef => {
        this.db
          .collection('charges')
          .doc(docRef.id)
          .update({
            docid: docRef.id,
          });
      });
  }


  cancelSubscriptions() {
    this.fbSubs.forEach(sub => sub.unsubscribe);
  }

  ngOnDestroy() {
    this.cancelSubscriptions();
  }
}
