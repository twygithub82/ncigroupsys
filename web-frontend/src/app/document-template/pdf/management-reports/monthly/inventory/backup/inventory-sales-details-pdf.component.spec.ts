import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { CustomerMonthlySalesReportDetailsPdfComponent } from "./customer-sales-details-pdf.component"
describe("CustomerMonthlySalesReportDetailsPdfComponent", () => {
  let component: CustomerMonthlySalesReportDetailsPdfComponent;
  let fixture: ComponentFixture<CustomerMonthlySalesReportDetailsPdfComponent>;
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
    imports: [CustomerMonthlySalesReportDetailsPdfComponent],
}).compileComponents();
    })
  );
  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerMonthlySalesReportDetailsPdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
