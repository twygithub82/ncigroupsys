import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TariffBufferComponent } from './tariff-buffer.component';

describe('TariffBufferComponent', () => {
  let component: TariffBufferComponent;
  let fixture: ComponentFixture<TariffBufferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TariffBufferComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TariffBufferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
