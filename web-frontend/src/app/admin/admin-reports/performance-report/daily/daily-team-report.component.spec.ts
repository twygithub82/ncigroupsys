import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyTeamReportComponent } from './daily-team-report.component';

describe('DailyTeamReportComponent', () => {
  let component: DailyTeamReportComponent;
  let fixture: ComponentFixture<DailyTeamReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DailyTeamReportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DailyTeamReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
