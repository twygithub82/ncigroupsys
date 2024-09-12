import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstimateTemplateNewComponent } from './estimate-template-new.component';

describe('EstimateNewComponent', () => {
  let component: EstimateTemplateNewComponent;
  let fixture: ComponentFixture<EstimateTemplateNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EstimateTemplateNewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EstimateTemplateNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
