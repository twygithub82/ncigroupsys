import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SurveyOthersDetailsComponent } from './survey-others-details.component';

describe('SurveyOthersDetailsComponent', () => {
  let component: SurveyOthersDetailsComponent;
  let fixture: ComponentFixture<SurveyOthersDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SurveyOthersDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SurveyOthersDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
