import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResidueDisposalApproval1Component } from './approval.component';

describe('ResidueDisposalApprovalComponent', () => {
  let component: ResidueDisposalApproval1Component;
  let fixture: ComponentFixture<ResidueDisposalApproval1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResidueDisposalApproval1Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ResidueDisposalApproval1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
