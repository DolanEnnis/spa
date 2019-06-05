import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ships',
  templateUrl: './ships.component.html',
  styleUrls: ['./ships.component.css']
})
export class ShipsComponent implements OnInit {
  due = "Due";
  awaitingBerth = "Awaiting Berth";
  alongside = "Alongside";
  eta = "ETA";
  etb = "ETB";
  ets = "ETS";

  constructor() { }

  ngOnInit() {
  }

}
