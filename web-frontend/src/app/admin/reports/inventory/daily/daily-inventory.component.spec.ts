import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyInventoryReportComponent } from './inventory-daily.component';

describe('DailyInventoryReportComponent', () => {
  let component: DailyInventoryReportComponent;
  let fixture: ComponentFixture<DailyInventoryReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DailyInventoryReportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DailyInventoryReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
