import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TariffCleaningNewComponent } from './tariff-cleaning-new.component';

describe('TariffCleaningNewComponent', () => {
  let component: TariffCleaningNewComponent;
  let fixture: ComponentFixture<TariffCleaningNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TariffCleaningNewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TariffCleaningNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
