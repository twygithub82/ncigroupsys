import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BilledTankComponent } from './billed-tank.component';

describe('BilledTankComponent', () => {
  let component: BilledTankComponent;
  let fixture: ComponentFixture<BilledTankComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BilledTankComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BilledTankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
