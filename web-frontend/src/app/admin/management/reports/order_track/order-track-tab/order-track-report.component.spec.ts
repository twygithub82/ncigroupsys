import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderTrackReportComponent } from './order-track-report.component';

describe('OrderTrackReportComponent', () => {
  let component: OrderTrackReportComponent;
  let fixture: ComponentFixture<OrderTrackReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderTrackReportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OrderTrackReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
