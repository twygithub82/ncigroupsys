import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LOLOBillingComponent } from './lolo-billing.component';

describe('LOLOBillingComponent', () => {
  let component: LOLOBillingComponent;
  let fixture: ComponentFixture<LOLOBillingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LOLOBillingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LOLOBillingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
