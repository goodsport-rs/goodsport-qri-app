import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Addreport2Component } from './addreport2.component';

describe('Addreport2Component', () => {
  let component: Addreport2Component;
  let fixture: ComponentFixture<Addreport2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Addreport2Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Addreport2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
