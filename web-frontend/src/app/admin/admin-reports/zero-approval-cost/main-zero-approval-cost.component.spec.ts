import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainZeroApprovalCostComponent } from './main-zero-approval-cost.component';

describe('MainZeroApprovalCostComponent', () => {
  let component: MainZeroApprovalCostComponent;
  let fixture: ComponentFixture<MainZeroApprovalCostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainZeroApprovalCostComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MainZeroApprovalCostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
