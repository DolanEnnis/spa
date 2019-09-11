import { Component, ViewChild, Input, OnInit } from '@angular/core';
import { MatTableDataSource, MatSort } from '@angular/material';
//import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
//import { AngularFirestore } from 'angularfire2/firestore';
//import { Subject } from 'rxjs/Subject';
import { now } from 'moment';

import { VisitService } from '../../services/visit.service';
import { Visit } from '../../shared/visit.model'

@Component({
  selector: 'app-berth-status',
  templateUrl: './berth-status.component.html',
  styleUrls: ['./berth-status.component.css']
})
export class BerthStatusComponent implements OnInit {


  @Input('status') status: string;
  @Input('et') et: string;
  @Input('dataSourse') dataSource: MatTableDataSource<Visit>;
  displayedColumns = ['ship', 'officeTime', 'note', 'pilot', 'updated', 'mt'];
  private future: number;

  @ViewChild(MatSort, { static: false }) sort: MatSort;

  constructor(private visitService: VisitService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.future = now() + 926080000 / 1000;
  }


  handleRowClick(row) {
    this.visitService.changecurrentVisit(row.visit);
    this.router.navigate(['edit', row.visit.docid]);
  }


}
