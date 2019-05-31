import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


import { AuthGuard } from './auth/auth.guard';
import { ShipsComponent } from './mainInfo/ships/ships.component'
import { NewVisitComponent } from './new-visit/new-visit.component';
import { AllShipsComponent } from './all-ships/all-ships.component';
import { DetailComponent } from './detail/detail.component'
import { OfficeComponent } from './mainInfo/office/office.component'
import { BerthComponent } from './mainInfo/berth/berth.component'
import { PilotComponent } from './mainInfo/pilot/pilot.component'
import { UpdateTripCanDeactaveGuardService } from './detail/update-trip-can-deactave-guard.service'
import { NewVisitCanDeactaveGuardService } from './new-visit/new-visit-can-deactive-guard.service'
import { ConfirmComponent } from './confirm/confirm.component'




const routes: Routes = [
  { path: '', component: ShipsComponent, canActivate: [AuthGuard] },
  {
    path: 'new', component: NewVisitComponent, canActivate: [AuthGuard],
    canDeactivate: [NewVisitCanDeactaveGuardService]
  },
  { path: 'stationBook', component: AllShipsComponent, canActivate: [AuthGuard] },
  {
    path: 'edit/:id', component: DetailComponent, canActivate: [AuthGuard],
    canDeactivate: [UpdateTripCanDeactaveGuardService]
  },
  { path: 'office', component: OfficeComponent, canActivate: [AuthGuard] },
  { path: 'office/foynes', component: BerthComponent, canActivate: [AuthGuard] },
  { path: 'office/aughinish', component: BerthComponent, canActivate: [AuthGuard] },
  { path: 'office/limerick', component: BerthComponent, canActivate: [AuthGuard] },
  { path: 'office/shannon', component: BerthComponent, canActivate: [AuthGuard] },
  { path: 'office/moneypoint', component: BerthComponent, canActivate: [AuthGuard] },
  { path: 'office/tarbert', component: BerthComponent, canActivate: [AuthGuard] },
  { path: 'pilot', component: PilotComponent, canActivate: [AuthGuard] },
  {
    path: 'confirm/:id', component: ConfirmComponent, canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
