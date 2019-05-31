import { Component, OnInit, EventEmitter, Output, OnDestroy } from '@angular/core';
import {Subscription} from 'rxjs/Subscription'; //to unsubscribe from observable

import { AuthService } from "../../auth/auth.service";
import {Patron} from '../../shared/patron.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Output() sidenavToggle = new EventEmitter<void>();

  isAuth = false;
  authSubscription: Subscription;
  private patron: Patron
  
  constructor(private authService: AuthService) {     
    }

  ngOnInit() {
    this.authSubscription =  this.authService.authChange.subscribe(authStatus => {
      this.isAuth = authStatus;
      this.patron = this.authService.getUser()
    });
  }

  onToggleSidenav() {
    this.sidenavToggle.emit();
  }

  onLogout() {
    this.authService.logout();
  }

  ngOnDestroy() {
    this.authSubscription.unsubscribe();
  }
}
