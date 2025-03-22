import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResidueMonthlyAdminReportComponent } from './residue-monthly.component';

describe('DailyInventoryReportComponent', () => {
  let component: ResidueMonthlyAdminReportComponent;
  let fixture: ComponentFixture<ResidueMonthlyAdminReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResidueMonthlyAdminReportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ResidueMonthlyAdminReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
