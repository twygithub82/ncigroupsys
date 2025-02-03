import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TariffLabourComponent } from './tariff-labour.component';

describe('TariffLabourComponent', () => {
  let component: TariffLabourComponent;
  let fixture: ComponentFixture<TariffLabourComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TariffLabourComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TariffLabourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
