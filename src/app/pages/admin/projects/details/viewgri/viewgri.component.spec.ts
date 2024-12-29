import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewgriComponent } from './viewgri.component';

describe('ViewgriComponent', () => {
  let component: ViewgriComponent;
  let fixture: ComponentFixture<ViewgriComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewgriComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewgriComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
