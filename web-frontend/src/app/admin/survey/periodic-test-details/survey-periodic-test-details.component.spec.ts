import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SurveyPeriodicTestDetailsComponent } from './survey-periodic-test-details.component';

describe('SurveyPeriodicTestDetailsComponent', () => {
  let component: SurveyPeriodicTestDetailsComponent;
  let fixture: ComponentFixture<SurveyPeriodicTestDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SurveyPeriodicTestDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SurveyPeriodicTestDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
