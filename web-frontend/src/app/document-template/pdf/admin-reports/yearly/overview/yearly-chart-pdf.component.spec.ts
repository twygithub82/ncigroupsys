import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { YearlyChartPdfComponent } from "./yearly-chart-pdf.component";
describe("MonthlyChartPdfComponent", () => {
  let component: YearlyChartPdfComponent;
  let fixture: ComponentFixture<YearlyChartPdfComponent>;
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
    imports: [YearlyChartPdfComponent],
}).compileComponents();
    })
  );
  beforeEach(() => {
    fixture = TestBed.createComponent(YearlyChartPdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
