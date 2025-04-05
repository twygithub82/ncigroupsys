import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SurveyorPerformanceReportComponent } from './surveyor-performance-report.component';

describe('SurveyorPerformanceReportComponent', () => {
  let component: SurveyorPerformanceReportComponent;
  let fixture: ComponentFixture<SurveyorPerformanceReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SurveyorPerformanceReportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SurveyorPerformanceReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
