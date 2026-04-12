import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { SurveyPeriodPdfComponent } from "./survey-period-pdf.component"
describe("SurveyPeriodPdfComponent", () => {
  let component: SurveyPeriodPdfComponent;
  let fixture: ComponentFixture<SurveyPeriodPdfComponent>;
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
    imports: [SurveyPeriodPdfComponent],
}).compileComponents();
    })
  );
  beforeEach(() => {
    fixture = TestBed.createComponent(SurveyPeriodPdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
