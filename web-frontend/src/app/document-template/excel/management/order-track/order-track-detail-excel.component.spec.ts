import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { OrderTrackingDetailExcelComponent } from "./order-track-detail-excel.component"
describe("OrderTrackingDetailExcelComponent", () => {
  let component: OrderTrackingDetailExcelComponent;
  let fixture: ComponentFixture<OrderTrackingDetailExcelComponent>;
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
    imports: [OrderTrackingDetailExcelComponent],
}).compileComponents();
    })
  );
  beforeEach(() => {
    fixture = TestBed.createComponent(OrderTrackingDetailExcelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
