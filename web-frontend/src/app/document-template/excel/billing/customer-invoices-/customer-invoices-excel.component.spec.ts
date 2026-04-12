import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { CustomerInvoicesExcelComponent } from "./customer-invoices-excel.component";
describe("CustomerInvoicesExcelComponent", () => {
  let component: CustomerInvoicesExcelComponent;
  let fixture: ComponentFixture<CustomerInvoicesExcelComponent>;
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
    imports: [CustomerInvoicesExcelComponent],
}).compileComponents();
    })
  );
  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerInvoicesExcelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
