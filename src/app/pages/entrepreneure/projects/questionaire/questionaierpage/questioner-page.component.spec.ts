import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionerPageComponent } from './questioner-page.component';

describe('QuestionaierpageComponent', () => {
  let component: QuestionerPageComponent;
  let fixture: ComponentFixture<QuestionerPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuestionerPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionerPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
