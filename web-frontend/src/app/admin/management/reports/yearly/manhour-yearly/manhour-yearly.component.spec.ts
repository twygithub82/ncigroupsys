import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManHourYearlyAdminReportComponent } from './manhour-yearly.component';

describe('ManHourYearlyAdminReportComponent', () => {
  let component: ManHourYearlyAdminReportComponent;
  let fixture: ComponentFixture<ManHourYearlyAdminReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManHourYearlyAdminReportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ManHourYearlyAdminReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
