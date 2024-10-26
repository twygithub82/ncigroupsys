import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobOrderAllocationComponent } from './job-order-allocation.component';

describe('JobOrderAllocationComponent', () => {
  let component: JobOrderAllocationComponent;
  let fixture: ComponentFixture<JobOrderAllocationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobOrderAllocationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(JobOrderAllocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
