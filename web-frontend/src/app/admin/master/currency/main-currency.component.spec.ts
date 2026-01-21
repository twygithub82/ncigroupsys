import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainCurrencyComponent } from './main-currency.component';

describe('MainCleaningComponent', () => {
  let component: MainCurrencyComponent;
  let fixture: ComponentFixture<MainCurrencyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainCurrencyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MainCurrencyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
