import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GateBillingComponent } from './gate-billing.component';

describe('GateBillingComponent', () => {
  let component: GateBillingComponent;
  let fixture: ComponentFixture<GateBillingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GateBillingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GateBillingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
