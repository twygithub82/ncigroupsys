import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InGateSurveyFormComponent } from './in-gate-survey-form.component';

describe('CleaningProceduresComponent', () => {
  let component: InGateSurveyFormComponent;
  let fixture: ComponentFixture<InGateSurveyFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InGateSurveyFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InGateSurveyFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
