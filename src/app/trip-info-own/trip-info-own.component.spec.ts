import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TripInfoOwnComponent } from './trip-info-own.component';

describe('TripInfoOwnComponent', () => {
  let component: TripInfoOwnComponent;
  let fixture: ComponentFixture<TripInfoOwnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TripInfoOwnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TripInfoOwnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
