import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Addreport3Component } from './addreport3.component';

describe('Addreport3Component', () => {
  let component: Addreport3Component;
  let fixture: ComponentFixture<Addreport3Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Addreport3Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Addreport3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
