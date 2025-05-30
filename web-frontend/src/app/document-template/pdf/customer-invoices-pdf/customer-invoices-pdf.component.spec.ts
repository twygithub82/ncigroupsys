import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { CustomerInvoicesPdfComponent } from "./customer-invoices-pdf.component";
describe("CustomerInvoicesPdfComponent", () => {
  let component: CustomerInvoicesPdfComponent;
  let fixture: ComponentFixture<CustomerInvoicesPdfComponent>;
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
    imports: [CustomerInvoicesPdfComponent],
}).compileComponents();
    })
  );
  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerInvoicesPdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
