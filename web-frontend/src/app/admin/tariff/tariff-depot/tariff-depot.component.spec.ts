import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TariffDepotComponent } from './tariff-depot.component';

describe('TariffDepotComponent', () => {
  let component: TariffDepotComponent;
  let fixture: ComponentFixture<TariffDepotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TariffDepotComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TariffDepotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
