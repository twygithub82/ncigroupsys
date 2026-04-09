import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { CustomerMonthlySalesReportDetailsExcelComponent } from "./customer-sales-details-excel.component"
describe("CustomerMonthlySalesReportDetailsExcelComponent", () => {
  let component: CustomerMonthlySalesReportDetailsExcelComponent;
  let fixture: ComponentFixture<CustomerMonthlySalesReportDetailsExcelComponent>;
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
    imports: [CustomerMonthlySalesReportDetailsExcelComponent],
}).compileComponents();
    })
  );
  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerMonthlySalesReportDetailsExcelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
