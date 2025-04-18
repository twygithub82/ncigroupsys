import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { RevenueMonthlySalesReportDetailsPdfComponent } from "./revenue-sales-details-pdf.component";
describe("RevenueMonthlySalesReportDetailsPdfComponent", () => {
  let component: RevenueMonthlySalesReportDetailsPdfComponent;
  let fixture: ComponentFixture<RevenueMonthlySalesReportDetailsPdfComponent>;
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
    imports: [RevenueMonthlySalesReportDetailsPdfComponent],
}).compileComponents();
    })
  );
  beforeEach(() => {
    fixture = TestBed.createComponent(RevenueMonthlySalesReportDetailsPdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
