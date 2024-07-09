import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TariffRepairComponent } from './tariff-repair.component';

describe('TariffRepairComponent', () => {
  let component: TariffRepairComponent;
  let fixture: ComponentFixture<TariffRepairComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TariffRepairComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TariffRepairComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
