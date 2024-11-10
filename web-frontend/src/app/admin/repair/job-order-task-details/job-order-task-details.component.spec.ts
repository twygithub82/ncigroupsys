import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobOrderTaskDetailsComponent } from './job-order-task-details.component';

describe('JobOrderTaskDetailsComponent', () => {
  let component: JobOrderTaskDetailsComponent;
  let fixture: ComponentFixture<JobOrderTaskDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobOrderTaskDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(JobOrderTaskDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
