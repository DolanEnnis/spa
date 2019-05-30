import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { environment } from '../environments/environment';
import { StoreModule } from '@ngrx/store';
import { OwlDateTimeModule, OwlNativeDateTimeModule, OWL_DATE_TIME_LOCALE } from 'ng-pick-datetime';
import { MomentModule } from 'angular2-moment';
import { AngularDateTimePickerModule } from 'angular2-datetimepicker';


import { AuthModule } from './auth/auth.module';
import { UIService } from './shared/ui.service';
import { VisitService } from './shared/visit.service';

import { HeaderComponent } from './navigation/header/header.component';
import { SidenavListComponent } from './navigation/sidenav-list/sidenav-list.component';
import { MaterialModule } from './material.module';
import { AppRoutingModule } from './app-routing.module';
import { AuthService } from './auth/auth.service';
import { DataService } from './shared/data.service';
import { AppComponent } from './app.component';
import { FooterComponent } from './footer/footer.component';
import { ShipsComponent } from './mainInfo/ships/ships.component';
import { appReducer } from './app.reducer';
import { NewVisitComponent } from './new-visit/new-visit.component';
import { AllShipsComponent } from './all-ships/all-ships.component';
import { DetailComponent } from './detail/detail.component';
import { TripInfoComponent } from './trip-info/trip-info.component';
import { StatusListComponent } from './mainInfo/status-list/status-list.component';
import { OfficeComponent } from './mainInfo/office/office.component';
import { BerthComponent } from './mainInfo/berth/berth.component';
import { UpdateTripCanDeactaveGuardService } from './detail/update-trip-can-deactave-guard.service';
import { NewVisitCanDeactaveGuardService } from './new-visit/new-visit-can-deactive-guard.service';
import { PilotComponent } from './mainInfo/pilot/pilot.component';
import { TripInfoOwnComponent } from './trip-info-own/trip-info-own.component';
import { BerthStatusComponent } from './mainInfo/berth-status/berth-status.component';
import { AllShipsInComponent } from './all-ships/all-ships-in/all-ships-in.component';
import { ConfirmComponent } from './confirm/confirm.component';
import { reducers, metaReducers } from './reducers';



@NgModule({
  declarations: [
    HeaderComponent,
    SidenavListComponent,
    AppComponent,
    FooterComponent,
    ShipsComponent,
    NewVisitComponent,
    AllShipsComponent,
    DetailComponent,
    TripInfoComponent,
    StatusListComponent,
    OfficeComponent,
    BerthComponent,
    PilotComponent,
    TripInfoOwnComponent,
    BerthStatusComponent,
    AllShipsInComponent,
    ConfirmComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    AuthModule,
    MaterialModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    StoreModule.forRoot({ ui: appReducer }),
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    MomentModule,
    AngularDateTimePickerModule,
    StoreModule.forRoot(reducers, { metaReducers }),
  ],
  providers: [AuthService,
    UIService,
    VisitService,
    DataService,
    UpdateTripCanDeactaveGuardService,
    NewVisitCanDeactaveGuardService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
