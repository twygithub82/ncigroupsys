import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TariffResidueComponent } from './tariff-residue.component';

describe('TariffResidueComponent', () => {
  let component: TariffResidueComponent;
  let fixture: ComponentFixture<TariffResidueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TariffResidueComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TariffResidueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
