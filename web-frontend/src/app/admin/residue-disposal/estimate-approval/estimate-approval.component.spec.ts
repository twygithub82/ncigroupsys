import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResidueDisposalEstimateApprovalComponent } from './estimate-approval.component';

describe('EstimateComponent', () => {
  let component: ResidueDisposalEstimateApprovalComponent;
  let fixture: ComponentFixture<ResidueDisposalEstimateApprovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResidueDisposalEstimateApprovalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ResidueDisposalEstimateApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
