import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CleaningPerformanceReportComponent } from './cleaning-performance-report.component';

describe('CleaningPerformanceReportComponent', () => {
  let component: CleaningPerformanceReportComponent;
  let fixture: ComponentFixture<CleaningPerformanceReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CleaningPerformanceReportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CleaningPerformanceReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
