import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { YearlySalesReportDetailsExcelComponent } from "./yearly-details-pdf.component"
describe("YearlySalesReportDetailsExcelComponent", () => {
  let component: YearlySalesReportDetailsExcelComponent;
  let fixture: ComponentFixture<YearlySalesReportDetailsExcelComponent>;
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
    imports: [YearlySalesReportDetailsExcelComponent],
}).compileComponents();
    })
  );
  beforeEach(() => {
    fixture = TestBed.createComponent(YearlySalesReportDetailsExcelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
