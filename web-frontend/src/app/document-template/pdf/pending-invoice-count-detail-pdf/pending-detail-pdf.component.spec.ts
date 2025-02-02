import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { PendingDetailPdfComponent } from "./pending-detail-pdf.component";
describe("CustomerInvoicesPdfComponent", () => {
  let component: PendingDetailPdfComponent;
  let fixture: ComponentFixture<PendingDetailPdfComponent>;
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
    imports: [PendingDetailPdfComponent],
}).compileComponents();
    })
  );
  beforeEach(() => {
    fixture = TestBed.createComponent(PendingDetailPdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
