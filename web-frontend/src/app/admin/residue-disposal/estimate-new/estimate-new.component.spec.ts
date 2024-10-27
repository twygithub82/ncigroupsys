import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResidueDisposalEstimateNewComponent } from './estimate-new.component';

describe('ResidueDisposalEstimateNewComponent', () => {
  let component: ResidueDisposalEstimateNewComponent;
  let fixture: ComponentFixture<ResidueDisposalEstimateNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResidueDisposalEstimateNewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ResidueDisposalEstimateNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
