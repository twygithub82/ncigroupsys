import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { YardStatusDetailSummaryPdfComponent } from "./yard-summary-pdf.component"
describe("YardStatusDetailSummaryPdfComponent", () => {
  let component: YardStatusDetailSummaryPdfComponent;
  let fixture: ComponentFixture<YardStatusDetailSummaryPdfComponent>;
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
    imports: [YardStatusDetailSummaryPdfComponent],
}).compileComponents();
    })
  );
  beforeEach(() => {
    fixture = TestBed.createComponent(YardStatusDetailSummaryPdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
