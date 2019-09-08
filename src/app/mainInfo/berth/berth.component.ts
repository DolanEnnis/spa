// Used for each port in Office View

import { Component, Input, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { MatTableDataSource, MatSort } from '@angular/material';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

import { VisitService } from '../../services/visit.service';
import { Visit } from '../../shared/visit.model';
import { ViewInfo } from '../../shared/view.model'

@Component({
  selector: 'app-berth',
  templateUrl: './berth.component.html',
  styleUrls: ['./berth.component.css'],
})
export class BerthComponent implements OnInit {
  @Input('berth') berth: string;
  @Input('tripsDue$') tripsDue$: Observable<Visit[]>;
  @Input('tripsWaiting$') tripsWaiting$: Observable<Visit[]>;
  @Input('tripsAlongside$') tripsAlongside$: Observable<Visit[]>;
  //displayedColumns = ['ship', 'gt', 'officeTime', 'note', 'pilot'];
  dataSourceDue = new MatTableDataSource<ViewInfo>();
  dataSourceWait = new MatTableDataSource<Visit>();
  dataSourceAlong = new MatTableDataSource<Visit>();
  noDue: number;
  noWaiting: number;
  noAlongside: number;
  mtURL: string;
  eta = "ETA";
  etb = "ETB";
  ets = "ETS";


  constructor(private visitService: VisitService, private router: Router) { }

  ngOnInit() {
    this.tripsDue$.subscribe(visits => {
      const visitInfo: any = visits.filter(
        element => element.inward.port == this.berth)
        .map(visit => {
          return {
            visit: visit,
            ship: visit.ship,
            pilot: visit.inward.pilot,
            gt: visit.gt,
            status: visit.status,
            berth: visit.inward.port,
            boarded: this.visitService.getBoarded(visit.eta),
            note: visit.inward.note,
            updateUser: visit.updateUser,
            updateTime: visit.updateTime,
            updateBy: visit.updatedBy,
            docid: visit.docid,
            confirmed: visit.inward.confirmed,
            inout: 'in',
            mt: visit.marineTraffic,
          }
        });
      this.noDue = visitInfo.length;
      visitInfo.sort(function (a, b) {
        return (a.boarded) - (b.boarded);
      });
      this.dataSourceDue = visitInfo;
    });

    this.tripsWaiting$.subscribe(visits => {
      const visitInfo: any = visits.filter(
        element => element.inward.port == this.berth)
        .map(visit => {
          return {
            visit: visit,
            ship: visit.ship,
            pilot: visit.inward.pilot,
            gt: visit.gt,
            status: visit.status,
            berth: visit.inward.port,
            boarded: this.visitService.getBoarded(visit.inward.boarding),
            note: visit.inward.note,
            updateUser: visit.updateUser,
            updateTime: visit.updateTime,
            updateBy: visit.updatedBy,
            docid: visit.docid,
            confirmed: visit.inward.confirmed,
            inout: 'in',
            mt: visit.marineTraffic,
          }
        });
      this.noWaiting = visitInfo.length;
      visitInfo.sort(function (a, b) {
        return (a.boarded) - (b.boarded);
      });
      this.dataSourceWait = visitInfo;
    });
    this.tripsAlongside$.subscribe(visits => {
      const visitInfo: any = visits.filter(
        element => element.outward.port == this.berth).
        map(visit => {
          return {
            visit: visit,
            ship: visit.ship,
            pilot: visit.outward.pilot,
            gt: visit.gt,
            status: visit.status,
            berth: visit.outward.port,
            boarded: this.visitService.getBoarded(visit.outward.boarding),
            note: visit.outward.note,
            updateUser: visit.updateUser,
            updateTime: visit.updateTime,
            updateBy: visit.updatedBy,
            docid: visit.docid,
            confirmed: visit.outward.confirmed,
            inout: 'in',
            mt: visit.marineTraffic,
          }
        });
      this.noAlongside = visitInfo.length;
      visitInfo.sort(function (a, b) {
        return (a.boarded) - (b.boarded);
      });
      this.dataSourceAlong = visitInfo;
    });
    this.mtURL = this.getmturl(this.berth);
  }


  getmturl(berth) {
    switch (berth) {
      case 'Anchorage':
        return 'https://www.marinetraffic.com/en/data/?asset_type=expected_arrivals&columns=shipname,recognized_next_port,reported_eta,arrived,show_on_live_map,dwt,ship_type&recognized_next_port_in|begins|SHANNON%20ESTUARY%20ANCH|recognized_next_port_in=23138';
        break;
      case 'Moneypoint':
        return 'https://www.marinetraffic.com/en/data/?asset_type=expected_arrivals&columns=shipname,recognized_next_port,reported_eta,arrived,show_on_live_map,dwt,ship_type&recognized_next_port_in|begins|MONEYPOINT|recognized_next_port_in=1454';
      case 'Tarbert':
        return 'https://www.marinetraffic.com/en/data/?asset_type=expected_arrivals&columns=shipname,recognized_next_port,reported_eta,arrived,show_on_live_map,dwt,ship_type&recognized_next_port_in|begins|TARBERT|recognized_next_port_in=22186';
      case 'Foynes':
        return 'https://www.marinetraffic.com/en/data/?asset_type=expected_arrivals&columns=shipname,recognized_next_port,reported_eta,arrived,show_on_live_map,dwt,ship_type&recognized_next_port_in|begins|FOYNES|recognized_next_port_in=1452';
      case 'Aughinish':
        return 'https://www.marinetraffic.com/en/data/?asset_type=expected_arrivals&columns=shipname,recognized_next_port,reported_eta,arrived,show_on_live_map,dwt,ship_type&recognized_next_port_in|begins|AUGHINISH|recognized_next_port_in=1453';
      case 'Shannon':
        return 'https://www.marinetraffic.com/en/data/?asset_type=expected_arrivals&columns=shipname,recognized_next_port,reported_eta,arrived,show_on_live_map,dwt,ship_type&recognized_next_port_in|begins|SHANNON|recognized_next_port_in=22185';
      case 'Limerick':
        return 'https://www.marinetraffic.com/en/data/?asset_type=expected_arrivals&columns=shipname,recognized_next_port,reported_eta,arrived,show_on_live_map,dwt,ship_type&recognized_next_port_in|begins|LIMERICK|recognized_next_port_in=405'
      default:
        return "error";
    }
  }
}
