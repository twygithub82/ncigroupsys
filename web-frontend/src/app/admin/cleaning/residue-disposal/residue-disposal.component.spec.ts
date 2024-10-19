import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResidueDisposalApprovalComponent } from './approval.component';

describe('CleaningProceduresComponent', () => {
  let component: ResidueDisposalApprovalComponent;
  let fixture: ComponentFixture<ResidueDisposalApprovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResidueDisposalApprovalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ResidueDisposalApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
