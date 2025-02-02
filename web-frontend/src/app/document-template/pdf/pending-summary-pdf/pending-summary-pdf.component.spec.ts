import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { PendingSummaryPdfComponent } from "./pending-summary-pdf.component";
describe("PendingSummaryPdfComponent", () => {
  let component: PendingSummaryPdfComponent;
  let fixture: ComponentFixture<PendingSummaryPdfComponent>;
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
    imports: [PendingSummaryPdfComponent],
}).compileComponents();
    })
  );
  beforeEach(() => {
    fixture = TestBed.createComponent(PendingSummaryPdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
