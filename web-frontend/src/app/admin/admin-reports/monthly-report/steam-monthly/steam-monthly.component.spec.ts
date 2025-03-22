import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SteamMonthlyAdminReportComponent } from './steam-monthly.component';

describe('DailyInventoryReportComponent', () => {
  let component: SteamMonthlyAdminReportComponent;
  let fixture: ComponentFixture<SteamMonthlyAdminReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SteamMonthlyAdminReportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SteamMonthlyAdminReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
