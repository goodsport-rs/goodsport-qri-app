import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkreportComponent } from './linkreport.component';

describe('LinkreportComponent', () => {
  let component: LinkreportComponent;
  let fixture: ComponentFixture<LinkreportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LinkreportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LinkreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
