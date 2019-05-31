import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllShipsComponent } from './all-ships.component';

describe('AllShipsComponent', () => {
  let component: AllShipsComponent;
  let fixture: ComponentFixture<AllShipsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllShipsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllShipsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
