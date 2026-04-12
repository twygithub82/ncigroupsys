import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { RevenueMonthlySalesReportDetailsExcelComponent } from "./revenue-sales-details-excel.component";
describe("RevenueMonthlySalesReportDetailsExcelComponent", () => {
  let component: RevenueMonthlySalesReportDetailsExcelComponent;
  let fixture: ComponentFixture<RevenueMonthlySalesReportDetailsExcelComponent>;
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
    imports: [RevenueMonthlySalesReportDetailsExcelComponent],
}).compileComponents();
    })
  );
  beforeEach(() => {
    fixture = TestBed.createComponent(RevenueMonthlySalesReportDetailsExcelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
