import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobOrderQCComponent } from './job-order-qc.component';

describe('JobOrderQCComponent', () => {
  let component: JobOrderQCComponent;
  let fixture: ComponentFixture<JobOrderQCComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobOrderQCComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(JobOrderQCComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
