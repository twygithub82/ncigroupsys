import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobOrderAllocationSteamComponent } from './job-order-allocation.component';

describe('JobOrderAllocationSteamComponent', () => {
  let component: JobOrderAllocationSteamComponent;
  let fixture: ComponentFixture<JobOrderAllocationSteamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobOrderAllocationSteamComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(JobOrderAllocationSteamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
