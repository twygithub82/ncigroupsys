import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OutGateSurveyComponent } from './out-gate-survey.component';

describe('OutGateSurveyComponent', () => {
  let component: OutGateSurveyComponent;
  let fixture: ComponentFixture<OutGateSurveyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OutGateSurveyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OutGateSurveyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
