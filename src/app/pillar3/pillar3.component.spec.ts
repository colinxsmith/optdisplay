import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Pillar3Component } from './pillar3.component';

describe('Pillar3Component', () => {
  let component: Pillar3Component;
  let fixture: ComponentFixture<Pillar3Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Pillar3Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Pillar3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
