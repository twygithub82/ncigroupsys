import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerformanceWeeklyManagementReportComponent } from './performance-weekly.component';

describe('PerformanceWeeklyManagementReportComponent', () => {
  let component: PerformanceWeeklyManagementReportComponent;
  let fixture: ComponentFixture<PerformanceWeeklyManagementReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PerformanceWeeklyManagementReportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PerformanceWeeklyManagementReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
