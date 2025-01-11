import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResidueBillingComponent } from './residue-billing.component';

describe('ResidueBillingComponent', () => {
  let component: ResidueBillingComponent;
  let fixture: ComponentFixture<ResidueBillingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResidueBillingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ResidueBillingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
