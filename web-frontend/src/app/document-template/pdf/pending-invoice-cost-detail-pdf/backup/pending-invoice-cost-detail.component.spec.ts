import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { PendingInvoiceCostDetailPdfComponent } from "./pending-invoice-cost-detail.component";
describe("PendingInvoiceCostDetailPdfComponent", () => {
  let component: PendingInvoiceCostDetailPdfComponent;
  let fixture: ComponentFixture<PendingInvoiceCostDetailPdfComponent>;
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
    imports: [PendingInvoiceCostDetailPdfComponent],
}).compileComponents();
    })
  );
  beforeEach(() => {
    fixture = TestBed.createComponent(PendingInvoiceCostDetailPdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
