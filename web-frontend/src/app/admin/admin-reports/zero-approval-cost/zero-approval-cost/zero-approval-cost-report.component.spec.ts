import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZeroApprovalCostReportComponent } from './zero-approval-cost-report.component';

describe('ZeroApprovalCostReportComponent', () => {
  let component: ZeroApprovalCostReportComponent;
  let fixture: ComponentFixture<ZeroApprovalCostReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ZeroApprovalCostReportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ZeroApprovalCostReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
