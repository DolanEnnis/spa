import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription'; //to unsubscribe from observable

import { AuthService } from '../auth/auth.service'
import { Patron } from '../shared/patron.model';
import { DataService } from "../services/data.service";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit, OnDestroy {
  isAuth = false;
  authSubscription: Subscription;
  message: string;

  constructor(private authService: AuthService,
    private data: DataService, ) { }

  ngOnInit() {
    this.authSubscription = this.authService.authChange.subscribe(authStatus => {
      this.isAuth = authStatus;
    });
    this.data.currentMessage.subscribe(message => this.message = message);
    (async () => {
      await this.delay(500);
      // delay so message is filled!
    })();

  }

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }


  ngOnDestroy() {
    this.authSubscription.unsubscribe();

  }

}
