import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResidueDisposalEstimateApprovalClientNewComponent } from './client-approval-new.component';

describe('ResidueDisposalEstimateApprovalClientNewComponent', () => {
  let component: ResidueDisposalEstimateApprovalClientNewComponent;
  let fixture: ComponentFixture<ResidueDisposalEstimateApprovalClientNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResidueDisposalEstimateApprovalClientNewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ResidueDisposalEstimateApprovalClientNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
