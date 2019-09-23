import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BulktradebarComponent } from './bulktradebar.component';

describe('BulktradebarComponent', () => {
  let component: BulktradebarComponent;
  let fixture: ComponentFixture<BulktradebarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BulktradebarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BulktradebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
