import { Component, OnInit, EventEmitter, Output, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription'; //to unsubscribe from observable

import { AuthService } from "../../auth/auth.service";
import { Patron } from '../../shared/patron.model';
import { DataService } from "../../services/data.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Output() sidenavToggle = new EventEmitter<void>();

  isAuth = false;
  authSubscription: Subscription;
  message: string;
  isUserPilot: boolean;
  pilots = ['Fergal', 'Brian', 'Peter', 'Fintan', 'Mark', 'Dave', 'Paddy', 'Cyril']

  constructor(private authService: AuthService,
    private data: DataService, ) {
  }

  ngOnInit() {
    this.authSubscription = this.authService.authChange.subscribe(authStatus => {
      this.isAuth = authStatus;
    });
    this.data.currentMessage.subscribe(message => {
      this.message = message;
    });
    (async () => {
      await this.delay(5000);
      // delay so message is filled!
      // find out if user is pilot
      this.isUserPilot = (this.pilots.includes(this.message))
    })();
  }



  onToggleSidenav() {
    this.sidenavToggle.emit();
  }

  onLogout() {
    this.authService.logout();
  }
  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  ngOnDestroy() {
    this.authSubscription.unsubscribe();
  }
}
