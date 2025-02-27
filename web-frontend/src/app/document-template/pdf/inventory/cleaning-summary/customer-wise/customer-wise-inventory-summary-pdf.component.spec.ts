import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { CustomerWiseInventorySummaryPdfComponent } from "./customer-wise-inventory-summary-pdf.component"
describe("LocationStatusSummaryPdfComponent", () => {
  let component: CustomerWiseInventorySummaryPdfComponent;
  let fixture: ComponentFixture<CustomerWiseInventorySummaryPdfComponent>;
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
    imports: [CustomerWiseInventorySummaryPdfComponent],
}).compileComponents();
    })
  );
  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerWiseInventorySummaryPdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
