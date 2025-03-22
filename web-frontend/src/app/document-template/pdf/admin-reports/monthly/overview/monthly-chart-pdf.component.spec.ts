import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { MonthlyChartPdfComponent } from "./monthly-chart-pdf.component"
describe("MonthlyChartPdfComponent", () => {
  let component: MonthlyChartPdfComponent;
  let fixture: ComponentFixture<MonthlyChartPdfComponent>;
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
    imports: [MonthlyChartPdfComponent],
}).compileComponents();
    })
  );
  beforeEach(() => {
    fixture = TestBed.createComponent(MonthlyChartPdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
