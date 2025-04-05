import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryMonthlyAdminReportComponent } from './inventory-monthly.component';

describe('InventoryMonthlyAdminReportComponent', () => {
  let component: InventoryMonthlyAdminReportComponent;
  let fixture: ComponentFixture<InventoryMonthlyAdminReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InventoryMonthlyAdminReportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InventoryMonthlyAdminReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
