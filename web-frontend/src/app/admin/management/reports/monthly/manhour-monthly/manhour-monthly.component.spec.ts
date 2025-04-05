import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManHourMonthlyAdminReportComponent } from './manhour-monthly.component';

describe('ManHourMonthlyAdminReportComponent', () => {
  let component: ManHourMonthlyAdminReportComponent;
  let fixture: ComponentFixture<ManHourMonthlyAdminReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManHourMonthlyAdminReportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ManHourMonthlyAdminReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
