import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreinspectionBillingComponent } from './preinspection-billing.component';

describe('PreinspectionBillingComponent', () => {
  let component: PreinspectionBillingComponent;
  let fixture: ComponentFixture<PreinspectionBillingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreinspectionBillingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PreinspectionBillingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
