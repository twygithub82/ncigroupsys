import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { MonthlyReportDetailsPdfComponent } from "./monthly-details-pdf.component"
describe("MonthlyReportDetailsPdfComponent", () => {
  let component: MonthlyReportDetailsPdfComponent;
  let fixture: ComponentFixture<MonthlyReportDetailsPdfComponent>;
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
    imports: [MonthlyReportDetailsPdfComponent],
}).compileComponents();
    })
  );
  beforeEach(() => {
    fixture = TestBed.createComponent(MonthlyReportDetailsPdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
