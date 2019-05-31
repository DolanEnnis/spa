import { Injectable,OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import { AngularFireAuth } from 'angularfire2/auth';
import { Store } from '@ngrx/store';
import { AngularFirestore } from 'angularfire2/firestore';
import 'rxjs/add/operator/switchMap'

import { Observable } from 'rxjs/Observable';
import { DataService } from "../shared/data.service";


//import { User } from './user.model';
import { AuthData } from './auth-data.model';
import { UIService } from '../shared/ui.service';
import * as fromApp from '../app.reducer';
import {Patron} from '../shared/patron.model';

interface User {
  email:string;
  userId: string;
}

@Injectable()
export class AuthService implements OnInit {
  message:string;
  newPatron: Patron;
  user: Observable<User>;
  authChange = new Subject<boolean>();
  private isAuthenticated = false;
  private currentPatron:Patron;

  constructor(private router: Router, 
              private afAuth: AngularFireAuth,
              private uiService: UIService,
              private afs: AngularFirestore,
              private data: DataService,
              private store: Store<{ui: fromApp.State, }>
            ) 
            {      }

  ngOnInit() {
              this.data.currentMessage.subscribe(message => this.message = message);
            }


  initAuthListener() {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.isAuthenticated = true;
        this.authChange.next(true);
        this.getUserData(user.uid);
        this.router.navigate(['/']);
      } else {
        this.authChange.next(false);
        this.router.navigate(['/login']);
        this.isAuthenticated = false;
        }
      });
    }



  registerUser(authData: AuthData) {
    this.store.dispatch({type:'START_LOADING'});
   
    this.afAuth.auth
      .createUserWithEmailAndPassword(authData.email, authData.password)
      .then((credential) => {
        console.log(credential.user.uid);
        this.newPatron = {
          uid: credential.user.uid,
          email: authData.email,
          displayName: authData.displayName,
          userType: authData.userType
        }
        console.log(this.newPatron);
        this.afs.collection('users').add(this.newPatron);
       // this.updateUserData(credential.user);
        this.store.dispatch({type:'STOP_LOADING'});
      })
      .catch(error => {
        this.store.dispatch({type:'STOP_LOADING'});
        this.uiService.showSnackbar(error.message,null, 3000,);
      });
  }


  login(authData: AuthData) {
    this.store.dispatch({type:'START_LOADING'});
    //this.uiService.loadingStateChanged.next(true);
    this.afAuth.auth
      .signInWithEmailAndPassword(authData.email, authData.password)
      .then((returneddata) => {
        this.store.dispatch({type:'STOP_LOADING'});
      })
      .catch(error => {
        this.store.dispatch({type:'STOP_LOADING'});
        this.uiService.showSnackbar(error.message,null, 30000,);
      })
  }

  logout() {
    this.afAuth.auth.signOut();
  }

  getUseruid(){
    return this.currentPatron.uid
  }

  isAuth() {
    return this.isAuthenticated;
  }

  private getUserData(uid) {
     var docRef = this.afs.collection("users");
     docRef.valueChanges().subscribe((patrons:Patron[])=>{
       for(let person of patrons){
         if (uid==person.uid){
           this.currentPatron=person;
           this.data.changeMessage(person.displayName);
         }
       }
       
     },error =>{
      console.log(error);
   }); 
   
  }

  getUser(){
    return this.currentPatron
  }

}