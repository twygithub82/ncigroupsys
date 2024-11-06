import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobOrderStartedComponent } from './job-order-started.component';

describe('JobOrderStartedComponent', () => {
  let component: JobOrderStartedComponent;
  let fixture: ComponentFixture<JobOrderStartedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobOrderStartedComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(JobOrderStartedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
