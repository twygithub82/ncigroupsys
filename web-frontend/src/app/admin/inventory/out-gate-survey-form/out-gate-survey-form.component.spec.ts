import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OutGateSurveyFormComponent } from './out-gate-survey-form.component';

describe('OutGateSurveyFormComponent', () => {
  let component: OutGateSurveyFormComponent;
  let fixture: ComponentFixture<OutGateSurveyFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OutGateSurveyFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OutGateSurveyFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
