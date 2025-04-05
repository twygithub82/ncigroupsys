import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryYearlyAdminReportComponent } from './inventory-yearly.component';

describe('InventoryYearlyAdminReportComponent', () => {
  let component: InventoryYearlyAdminReportComponent;
  let fixture: ComponentFixture<InventoryYearlyAdminReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InventoryYearlyAdminReportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InventoryYearlyAdminReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
