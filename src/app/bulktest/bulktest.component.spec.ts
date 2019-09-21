import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BulktestComponent } from './bulktest.component';

describe('BulktestComponent', () => {
  let component: BulktestComponent;
  let fixture: ComponentFixture<BulktestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BulktestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BulktestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
