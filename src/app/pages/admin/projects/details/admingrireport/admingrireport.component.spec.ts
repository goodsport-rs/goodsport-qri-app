import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmingrireportComponent } from './admingrireport.component';

describe('AdmingrireportComponent', () => {
  let component: AdmingrireportComponent;
  let fixture: ComponentFixture<AdmingrireportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdmingrireportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdmingrireportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
