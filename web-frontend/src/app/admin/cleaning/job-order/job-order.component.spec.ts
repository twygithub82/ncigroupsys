import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobOrderCleaningComponent } from './job-order.component';

describe('JobOrderCleaningComponent', () => {
  let component: JobOrderCleaningComponent;
  let fixture: ComponentFixture<JobOrderCleaningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobOrderCleaningComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(JobOrderCleaningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
