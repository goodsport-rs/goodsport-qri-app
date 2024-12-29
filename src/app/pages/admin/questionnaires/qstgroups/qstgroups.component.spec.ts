import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QstgroupsComponent } from './qstgroups.component';

describe('QstgroupsComponent', () => {
  let component: QstgroupsComponent;
  let fixture: ComponentFixture<QstgroupsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QstgroupsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QstgroupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
