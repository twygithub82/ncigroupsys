import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResidueDisposalEstimateApprovalNewComponent } from './estimate-approval-new.component';

describe('ResidueDisposalEstimateApprovalNewComponent', () => {
  let component: ResidueDisposalEstimateApprovalNewComponent;
  let fixture: ComponentFixture<ResidueDisposalEstimateApprovalNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResidueDisposalEstimateApprovalNewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ResidueDisposalEstimateApprovalNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
