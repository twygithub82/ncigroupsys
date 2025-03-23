import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SteamYearlyAdminReportComponent } from './steam-yearly.component';

describe('SteamYearlyAdminReportComponent', () => {
  let component: SteamYearlyAdminReportComponent;
  let fixture: ComponentFixture<SteamYearlyAdminReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SteamYearlyAdminReportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SteamYearlyAdminReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
