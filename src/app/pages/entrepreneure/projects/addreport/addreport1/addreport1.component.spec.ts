import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Addreport1Component } from './addreport1.component';

describe('Addreport1Component', () => {
  let component: Addreport1Component;
  let fixture: ComponentFixture<Addreport1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Addreport1Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Addreport1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
