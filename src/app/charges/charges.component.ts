import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';

import Tabulator from 'tabulator-tables';



@Component({
  selector: 'app-charges',
  templateUrl: './charges.component.html',
  styleUrls: ['./charges.component.css']
})
export class ChargesComponent implements OnInit {

  title = 'DemoTabulator';
  people: IPerson[] = [];
  columnNames: any[] = [];
  myTable: Tabulator;

  ngOnInit() {
    this.people = [
      { id: 1, firstName: "John", lastName: "Smith", state: "Ohio" },
      { id: 2, firstName: "Jane", lastName: "Doe", state: "Iowa" },
      { id: 3, firstName: "Bill", lastName: "Great", state: "Hawaii" },
      { id: 4, firstName: "Ted", lastName: "Adventure", state: "Arizona" }
    ];

    this.columnNames = [
      { title: "Id", field: "id" },
      { title: "First Name", field: "firstName" },
      { title: "Last Name", field: "lastName" },
      { title: "Location", field: "state" }
    ];

    // reference id of div where table is to be displayed (prepend #)
    this.myTable = new Tabulator("#tabulator-div");
    this.myTable.setColumns(this.columnNames);
    this.myTable.setData(this.people);
  }
}

interface IPerson {
  id: number,
  firstName: string,
  lastName: string,
  state: string
}