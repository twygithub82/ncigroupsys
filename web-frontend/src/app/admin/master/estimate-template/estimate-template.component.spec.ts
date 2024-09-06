import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstimateTemplateComponent } from './estimate-template.component'

describe('EstimateTemplateComponent', () => {
  let component: EstimateTemplateComponent;
  let fixture: ComponentFixture<EstimateTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EstimateTemplateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EstimateTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
