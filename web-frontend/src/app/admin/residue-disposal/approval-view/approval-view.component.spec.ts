import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResidueDisposalApprovalViewComponent } from './approval-view.component';

describe('ResidueDisposalApprovalViewComponent', () => {
  let component: ResidueDisposalApprovalViewComponent;
  let fixture: ComponentFixture<ResidueDisposalApprovalViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResidueDisposalApprovalViewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ResidueDisposalApprovalViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
