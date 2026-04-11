import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { PendingInvoiceCostDetailExcelComponent } from "./pending-invoice-cost-detail-excel.component";
describe("PendingInvoiceCostDetailPdfComponent", () => {
  let component: PendingInvoiceCostDetailExcelComponent;
  let fixture: ComponentFixture<PendingInvoiceCostDetailExcelComponent>;
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
    imports: [PendingInvoiceCostDetailExcelComponent],
}).compileComponents();
    })
  );
  beforeEach(() => {
    fixture = TestBed.createComponent(PendingInvoiceCostDetailExcelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
