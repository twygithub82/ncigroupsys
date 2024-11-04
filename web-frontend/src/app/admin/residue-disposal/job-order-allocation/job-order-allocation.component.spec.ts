import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobOrderAllocationResidueDisposalComponent } from './job-order-allocation.component';

describe('JobOrderAllocationResidueDisposalComponent', () => {
  let component: JobOrderAllocationResidueDisposalComponent;
  let fixture: ComponentFixture<JobOrderAllocationResidueDisposalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobOrderAllocationResidueDisposalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(JobOrderAllocationResidueDisposalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
