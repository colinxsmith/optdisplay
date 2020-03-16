import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsedartComponent } from './usedart.component';

describe('UsedartComponent', () => {
  let component: UsedartComponent;
  let fixture: ComponentFixture<UsedartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsedartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsedartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
