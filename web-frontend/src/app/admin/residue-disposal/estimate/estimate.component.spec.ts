import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResidueDisposalEstimateComponent } from './estimate.component';

describe('EstimateComponent', () => {
  let component: ResidueDisposalEstimateComponent;
  let fixture: ComponentFixture<ResidueDisposalEstimateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResidueDisposalEstimateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ResidueDisposalEstimateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
