import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobOrderTaskComponent } from './job-order-task.component';

describe('JobOrderTaskComponent', () => {
  let component: JobOrderTaskComponent;
  let fixture: ComponentFixture<JobOrderTaskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobOrderTaskComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(JobOrderTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
