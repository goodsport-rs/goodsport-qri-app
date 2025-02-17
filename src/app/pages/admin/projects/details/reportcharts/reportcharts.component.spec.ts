import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportchartsComponent } from './reportcharts.component';

describe('ReportchartsComponent', () => {
  let component: ReportchartsComponent;
  let fixture: ComponentFixture<ReportchartsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportchartsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportchartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
