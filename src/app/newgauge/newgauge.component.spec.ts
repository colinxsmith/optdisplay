import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewgaugeComponent } from './newgauge.component';

describe('NewgaugeComponent', () => {
  let component: NewgaugeComponent;
  let fixture: ComponentFixture<NewgaugeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewgaugeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewgaugeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
