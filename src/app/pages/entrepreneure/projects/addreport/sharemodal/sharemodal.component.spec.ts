import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharemodalComponent } from './sharemodal.component';

describe('SharemodalComponent', () => {
  let component: SharemodalComponent;
  let fixture: ComponentFixture<SharemodalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SharemodalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SharemodalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
