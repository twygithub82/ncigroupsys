import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResidueDisposalEstimateApprovalClientComponent } from './client-approval.component';

describe('ResidueDisposalEstimateApprovalClientComponent', () => {
  let component: ResidueDisposalEstimateApprovalClientComponent;
  let fixture: ComponentFixture<ResidueDisposalEstimateApprovalClientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResidueDisposalEstimateApprovalClientComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ResidueDisposalEstimateApprovalClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
