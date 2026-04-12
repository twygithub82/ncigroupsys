import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { PendingEstimateReportExcelComponent } from "./pending-estimate-report-excel.component"
describe("PendingEstimateReportExcelComponent", () => {
  let component: PendingEstimateReportExcelComponent;
  let fixture: ComponentFixture<PendingEstimateReportExcelComponent>;
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
    imports: [PendingEstimateReportExcelComponent],
}).compileComponents();
    })
  );
  beforeEach(() => {
    fixture = TestBed.createComponent(PendingEstimateReportExcelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
