import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { YearlyReportDetailsPdfComponent } from "./yearly-details-pdf.component"
describe("YearlyReportDetailsPdfComponent", () => {
  let component: YearlyReportDetailsPdfComponent;
  let fixture: ComponentFixture<YearlyReportDetailsPdfComponent>;
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
    imports: [YearlyReportDetailsPdfComponent],
}).compileComponents();
    })
  );
  beforeEach(() => {
    fixture = TestBed.createComponent(YearlyReportDetailsPdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
