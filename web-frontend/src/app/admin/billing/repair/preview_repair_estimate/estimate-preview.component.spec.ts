import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepairEstimateNewComponent } from './estimate-new.component';

describe('RepairEstimateNewComponent', () => {
  let component: RepairEstimateNewComponent;
  let fixture: ComponentFixture<RepairEstimateNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RepairEstimateNewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RepairEstimateNewComponent);
    component = fixture.componentInstance;RepairEstimateNewComponent
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
