import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { LocationStatusSummaryPdfComponent } from "./location-status-summary-pdf.component"
describe("LocationStatusSummaryPdfComponent", () => {
  let component: LocationStatusSummaryPdfComponent;
  let fixture: ComponentFixture<LocationStatusSummaryPdfComponent>;
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
    imports: [LocationStatusSummaryPdfComponent],
}).compileComponents();
    })
  );
  beforeEach(() => {
    fixture = TestBed.createComponent(LocationStatusSummaryPdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
