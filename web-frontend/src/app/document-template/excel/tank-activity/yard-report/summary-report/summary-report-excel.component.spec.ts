import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { YardSummaryReportExcelComponent } from "./summary-report-excel.component"
describe("YardSummaryReportExcelComponent", () => {
  let component: YardSummaryReportExcelComponent;
  let fixture: ComponentFixture<YardSummaryReportExcelComponent>;
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
    imports: [YardSummaryReportExcelComponent],
}).compileComponents();
    })
  );
  beforeEach(() => {
    fixture = TestBed.createComponent(YardSummaryReportExcelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
