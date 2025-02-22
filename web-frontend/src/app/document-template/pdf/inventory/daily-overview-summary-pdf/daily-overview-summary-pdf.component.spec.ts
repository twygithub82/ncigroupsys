import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { DailySummaryPdfComponent } from "./daily-summary-pdf.component"
describe("DailySummaryPdfComponent", () => {
  let component: DailySummaryPdfComponent;
  let fixture: ComponentFixture<DailySummaryPdfComponent>;
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
    imports: [DailySummaryPdfComponent],
}).compileComponents();
    })
  );
  beforeEach(() => {
    fixture = TestBed.createComponent(DailySummaryPdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
