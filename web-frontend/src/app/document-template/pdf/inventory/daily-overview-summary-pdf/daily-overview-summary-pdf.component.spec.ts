import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { DailyOverviewSummaryPdfComponent } from "./daily-overview-summary-pdf.component"
describe("DailyOverviewSummaryPdfComponent", () => {
  let component: DailyOverviewSummaryPdfComponent;
  let fixture: ComponentFixture<DailyOverviewSummaryPdfComponent>;
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
    imports: [DailyOverviewSummaryPdfComponent],
}).compileComponents();
    })
  );
  beforeEach(() => {
    fixture = TestBed.createComponent(DailyOverviewSummaryPdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
