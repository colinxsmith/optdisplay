import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BubbletableComponent } from './bubbletable.component';

describe('BubbletableComponent', () => {
  let component: BubbletableComponent;
  let fixture: ComponentFixture<BubbletableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BubbletableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BubbletableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
