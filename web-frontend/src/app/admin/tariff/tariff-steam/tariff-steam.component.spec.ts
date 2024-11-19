import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TariffSteamComponent } from './tariff-steam.component';

describe('TariffSteamComponent', () => {
  let component: TariffSteamComponent;
  let fixture: ComponentFixture<TariffSteamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TariffSteamComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TariffSteamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
