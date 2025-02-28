import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InGateSurveyComponent } from './in-gate-survey.component';

describe('CleaningProceduresComponent', () => {
  let component: InGateSurveyComponent;
  let fixture: ComponentFixture<InGateSurveyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InGateSurveyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InGateSurveyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
