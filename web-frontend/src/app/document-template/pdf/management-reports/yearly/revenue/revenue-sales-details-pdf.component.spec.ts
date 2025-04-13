import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { RevenueYearlySalesReportDetailsPdfComponent } from "./revenue-sales-details-pdf.component";
describe("RevenueYearlySalesReportDetailsPdfComponent", () => {
  let component: RevenueYearlySalesReportDetailsPdfComponent;
  let fixture: ComponentFixture<RevenueYearlySalesReportDetailsPdfComponent>;
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
    imports: [RevenueYearlySalesReportDetailsPdfComponent],
}).compileComponents();
    })
  );
  beforeEach(() => {
    fixture = TestBed.createComponent(RevenueYearlySalesReportDetailsPdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
