import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SteamPerformanceReportComponent } from './steam-performance-report.component';

describe('SteamPerformanceReportComponent', () => {
  let component: SteamPerformanceReportComponent;
  let fixture: ComponentFixture<SteamPerformanceReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SteamPerformanceReportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SteamPerformanceReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
