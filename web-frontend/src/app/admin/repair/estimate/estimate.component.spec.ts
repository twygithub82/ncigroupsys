import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepairEstimateComponent } from './estimate.component';

describe('EstimateComponent', () => {
  let component: RepairEstimateComponent;
  let fixture: ComponentFixture<RepairEstimateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RepairEstimateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RepairEstimateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
