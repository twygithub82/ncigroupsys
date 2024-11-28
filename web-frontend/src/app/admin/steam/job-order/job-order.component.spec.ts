import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobOrderSteamComponent } from './job-order.component';

describe('JobOrderSteamComponent', () => {
  let component: JobOrderSteamComponent;
  let fixture: ComponentFixture<JobOrderSteamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobOrderSteamComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(JobOrderSteamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
