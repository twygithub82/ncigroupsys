import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { WeeklyPerformanceReportDetailsExcelComponent } from "./performance-weekly-details-excel.component";
describe("WeeklyPerformanceReportDetailsExcelComponent", () => {
  let component: WeeklyPerformanceReportDetailsExcelComponent;
  let fixture: ComponentFixture<WeeklyPerformanceReportDetailsExcelComponent>;
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
    imports: [WeeklyPerformanceReportDetailsExcelComponent],
}).compileComponents();
    })
  );
  beforeEach(() => {
    fixture = TestBed.createComponent(WeeklyPerformanceReportDetailsExcelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
