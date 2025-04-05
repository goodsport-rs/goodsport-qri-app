import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectQuestionnairesComponent } from './project-questionnaires.component';

describe('ProjectQuestionnairesComponent', () => {
  let component: ProjectQuestionnairesComponent;
  let fixture: ComponentFixture<ProjectQuestionnairesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectQuestionnairesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectQuestionnairesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
