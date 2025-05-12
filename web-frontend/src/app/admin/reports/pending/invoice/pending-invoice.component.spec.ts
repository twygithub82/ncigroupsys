import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingInvoiceComponent } from './pending-invoice.component';

describe('CleanBillingComponent', () => {
  let component: PendingInvoiceComponent;
  let fixture: ComponentFixture<PendingInvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PendingInvoiceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PendingInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
