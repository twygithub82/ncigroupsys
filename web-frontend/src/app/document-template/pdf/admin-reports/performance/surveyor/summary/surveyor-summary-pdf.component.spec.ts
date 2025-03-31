import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { CleanerPerformanceDetailPdfComponent } from "./cleaner-detail-pdf.component"
describe("CleanerPerformanceDetailPdfComponent", () => {
  let component: CleanerPerformanceDetailPdfComponent;
  let fixture: ComponentFixture<CleanerPerformanceDetailPdfComponent>;
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
    imports: [CleanerPerformanceDetailPdfComponent],
}).compileComponents();
    })
  );
  beforeEach(() => {
    fixture = TestBed.createComponent(CleanerPerformanceDetailPdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
