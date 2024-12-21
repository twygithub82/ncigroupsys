import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SurveyPeriodicTestComponent } from './survey-periodic-test.component';

describe('SurveyPeriodicTestComponent', () => {
  let component: SurveyPeriodicTestComponent;
  let fixture: ComponentFixture<SurveyPeriodicTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SurveyPeriodicTestComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SurveyPeriodicTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
