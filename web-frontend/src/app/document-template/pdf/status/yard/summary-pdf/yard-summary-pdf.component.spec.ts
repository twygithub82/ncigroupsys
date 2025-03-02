import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { YardSummaryPdfComponent } from "./yard-summary-pdf.component"
describe("YardSummaryPdfComponent", () => {
  let component: YardSummaryPdfComponent;
  let fixture: ComponentFixture<YardSummaryPdfComponent>;
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
    imports: [YardSummaryPdfComponent],
}).compileComponents();
    })
  );
  beforeEach(() => {
    fixture = TestBed.createComponent(YardSummaryPdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
