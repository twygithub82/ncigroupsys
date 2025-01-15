import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CleanBillingComponent } from './clean-billing.component';

describe('CleanBillingComponent', () => {
  let component: CleanBillingComponent;
  let fixture: ComponentFixture<CleanBillingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CleanBillingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CleanBillingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
