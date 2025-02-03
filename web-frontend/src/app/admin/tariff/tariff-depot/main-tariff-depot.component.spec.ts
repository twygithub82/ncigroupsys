import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainTariffDepotComponent } from './main-tariff-depot.component';

describe('MainCleaningComponent', () => {
  let component: MainTariffDepotComponent;
  let fixture: ComponentFixture<MainTariffDepotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainTariffDepotComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MainTariffDepotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
