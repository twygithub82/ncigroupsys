import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillingBranchComponent } from './billing-branch.component';

describe('PackageResidueComponent', () => {
  let component: BillingBranchComponent;
  let fixture: ComponentFixture<BillingBranchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BillingBranchComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BillingBranchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
