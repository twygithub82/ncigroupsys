import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepairBillingComponent } from './repair-billing.component';

describe('RepairBillingComponent', () => {
  let component: RepairBillingComponent;
  let fixture: ComponentFixture<RepairBillingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RepairBillingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RepairBillingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
