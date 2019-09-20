import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BulktradeComponent } from './bulktrade.component';

describe('BulktradeComponent', () => {
  let component: BulktradeComponent;
  let fixture: ComponentFixture<BulktradeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BulktradeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BulktradeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
