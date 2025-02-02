import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SteamBillingComponent } from './steam-billing.component';

describe('SteamBillingComponent', () => {
  let component: SteamBillingComponent;
  let fixture: ComponentFixture<SteamBillingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SteamBillingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SteamBillingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
