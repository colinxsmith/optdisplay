import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VertBarChartComponent } from './vert-bar-chart.component';

describe('VertBarChartComponent', () => {
  let component: VertBarChartComponent;
  let fixture: ComponentFixture<VertBarChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VertBarChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VertBarChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
