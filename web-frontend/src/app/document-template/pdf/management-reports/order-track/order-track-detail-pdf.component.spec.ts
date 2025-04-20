import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { OrderTrackingDetailPdfComponent } from "./order-track-detail-pdf.component"
describe("OrderTrackingDetailPdfComponent", () => {
  let component: OrderTrackingDetailPdfComponent;
  let fixture: ComponentFixture<OrderTrackingDetailPdfComponent>;
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
    imports: [OrderTrackingDetailPdfComponent],
}).compileComponents();
    })
  );
  beforeEach(() => {
    fixture = TestBed.createComponent(OrderTrackingDetailPdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
