import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { CleanReportPdfComponent } from "./cleaning-report-pdf.component";
describe("CleanReportPdfComponent", () => {
  let component: CleanReportPdfComponent;
  let fixture: ComponentFixture<CleanReportPdfComponent>;
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
    imports: [CleanReportPdfComponent],
}).compileComponents();
    })
  );
  beforeEach(() => {
    fixture = TestBed.createComponent(CleanReportPdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
