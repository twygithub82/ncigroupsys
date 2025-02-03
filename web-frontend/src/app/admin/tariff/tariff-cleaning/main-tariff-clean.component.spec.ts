import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainTariffCleaningComponent } from './main-tariff-clean.component';

describe('MainTariffCleaningComponent', () => {
  let component: MainTariffCleaningComponent;
  let fixture: ComponentFixture<MainTariffCleaningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainTariffCleaningComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MainTariffCleaningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
