import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TariffCleaningComponent } from './tariff-cleaning.component';

describe('TariffCleaningComponent', () => {
  let component: TariffCleaningComponent;
  let fixture: ComponentFixture<TariffCleaningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TariffCleaningComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TariffCleaningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
