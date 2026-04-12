import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { RevenueYearlySalesReportDetailsExcelComponent } from "./revenue-sales-details-excel.component";
describe("RevenueYearlySalesReportDetailsPdfComponent", () => {
  let component: RevenueYearlySalesReportDetailsExcelComponent;
  let fixture: ComponentFixture<RevenueYearlySalesReportDetailsExcelComponent>;
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
    imports: [RevenueYearlySalesReportDetailsExcelComponent],
}).compileComponents();
    })
  );
  beforeEach(() => {
    fixture = TestBed.createComponent(RevenueYearlySalesReportDetailsExcelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
