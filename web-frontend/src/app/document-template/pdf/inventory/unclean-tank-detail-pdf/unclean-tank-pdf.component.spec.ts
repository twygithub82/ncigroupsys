import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { CustomerDetailPdfComponent } from "./customer-detail-pdf.component"
describe("CustomerDetailPdfComponent", () => {
  let component: CustomerDetailPdfComponent;
  let fixture: ComponentFixture<CustomerDetailPdfComponent>;
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
    imports: [CustomerDetailPdfComponent],
}).compileComponents();
    })
  );
  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerDetailPdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
