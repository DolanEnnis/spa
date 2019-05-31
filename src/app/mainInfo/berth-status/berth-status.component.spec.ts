import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BerthStatusComponent } from './berth-status.component';

describe('BerthStatusComponent', () => {
  let component: BerthStatusComponent;
  let fixture: ComponentFixture<BerthStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BerthStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BerthStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
