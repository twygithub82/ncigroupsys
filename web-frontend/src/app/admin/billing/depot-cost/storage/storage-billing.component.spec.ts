import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StorageBillingComponent } from './storage-billing.component';

describe('StorageBillingComponent', () => {
  let component: StorageBillingComponent;
  let fixture: ComponentFixture<StorageBillingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StorageBillingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StorageBillingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
