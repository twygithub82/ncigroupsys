import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { DailyDetailSummaryPdfComponent } from "./daily-summary-pdf.component"
describe("DailyDetailSummaryPdfComponent", () => {
  let component: DailyDetailSummaryPdfComponent;
  let fixture: ComponentFixture<DailyDetailSummaryPdfComponent>;
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
    imports: [DailyDetailSummaryPdfComponent],
}).compileComponents();
    })
  );
  beforeEach(() => {
    fixture = TestBed.createComponent(DailyDetailSummaryPdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
