import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillingBranchNewComponent } from './billing-branch-new.component';

describe('EstimateNewComponent', () => {
  let component: BillingBranchNewComponent;
  let fixture: ComponentFixture<BillingBranchNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BillingBranchNewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BillingBranchNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
