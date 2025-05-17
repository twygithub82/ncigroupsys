import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { YearlySalesReportDetailsPdfComponent } from "./yearly-details-pdf.component"
describe("YearlySalesReportDetailsPdfComponent", () => {
  let component: YearlySalesReportDetailsPdfComponent;
  let fixture: ComponentFixture<YearlySalesReportDetailsPdfComponent>;
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
    imports: [YearlySalesReportDetailsPdfComponent],
}).compileComponents();
    })
  );
  beforeEach(() => {
    fixture = TestBed.createComponent(YearlySalesReportDetailsPdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
