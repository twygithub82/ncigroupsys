import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { CustomerWiseInventorySummaryExcelComponent } from "./customer-wise-inventory-summary-excel.component"
describe("LocationStatusSummaryPdfComponent", () => {
  let component: CustomerWiseInventorySummaryExcelComponent;
  let fixture: ComponentFixture<CustomerWiseInventorySummaryExcelComponent>;
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
    imports: [CustomerWiseInventorySummaryExcelComponent],
}).compileComponents();
    })
  );
  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerWiseInventorySummaryExcelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
