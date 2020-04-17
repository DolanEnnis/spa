import { Component, ViewChild, Input, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';

import { VisitService } from '../../services/visit.service';
import { ViewInfo } from '../../shared/view.model';


@Component({
  selector: 'app-all-ships-in',
  templateUrl: './all-ships-in.component.html',
  styleUrls: ['./all-ships-in.component.css']
})
export class AllShipsInComponent implements OnInit {

  displayedColumns = ['boarded', 'ship', 'gt', 'berth', 'pilot', 'confirmed',];
  private today: number;
  @Input('dataSourse') dataSource: MatTableDataSource<ViewInfo>;
  @Input('direction') direction: string;

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  private et: string;

  constructor(
    private visitService: VisitService,
    private router: Router
  ) { }

  ngOnInit() {
    if (this.direction == "in") {
      this.et = "Arrived";
    };
    if (this.direction == "out") {
      this.et = "Sailed";
    };
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  doFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getColor(row) {
    return this.visitService.getColor(row.status)
  }

  handleRowClick(row: ViewInfo) {
    this.visitService.changecurrentVisit(row.visit);
    this.router.navigate(['edit', row.docid]);
  }
}
