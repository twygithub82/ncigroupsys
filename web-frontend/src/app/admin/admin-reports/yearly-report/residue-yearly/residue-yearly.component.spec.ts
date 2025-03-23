import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResidueYearlyAdminReportComponent } from './residue-yearly.component';

describe('ResidueYearlyAdminReportComponent', () => {
  let component: ResidueYearlyAdminReportComponent;
  let fixture: ComponentFixture<ResidueYearlyAdminReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResidueYearlyAdminReportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ResidueYearlyAdminReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
