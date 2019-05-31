import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllShipsInComponent } from './all-ships-in.component';

describe('AllShipsInComponent', () => {
  let component: AllShipsInComponent;
  let fixture: ComponentFixture<AllShipsInComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllShipsInComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllShipsInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
