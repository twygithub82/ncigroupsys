import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobOrderResidueDisposalComponent } from './job-order.component';

describe('JobOrderResidueDisposalComponent', () => {
  let component: JobOrderResidueDisposalComponent;
  let fixture: ComponentFixture<JobOrderResidueDisposalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobOrderResidueDisposalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(JobOrderResidueDisposalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
