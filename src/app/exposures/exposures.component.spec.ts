import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExposuresComponent } from './exposures.component';

describe('ExposuresComponent', () => {
  let component: ExposuresComponent;
  let fixture: ComponentFixture<ExposuresComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExposuresComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExposuresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
