import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UseRadarComponent } from './use-radar.component';

describe('UseRadarComponent', () => {
  let component: UseRadarComponent;
  let fixture: ComponentFixture<UseRadarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UseRadarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UseRadarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
