import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstimateNewComponent } from './estimate-new.component';

describe('EstimateNewComponent', () => {
  let component: EstimateNewComponent;
  let fixture: ComponentFixture<EstimateNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EstimateNewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EstimateNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
