import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { TankSurveyPdfComponent } from "./tank-survey-pdf.component"
describe("TankSurveyPdfComponent", () => {
  let component: TankSurveyPdfComponent;
  let fixture: ComponentFixture<TankSurveyPdfComponent>;
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
    imports: [TankSurveyPdfComponent],
}).compileComponents();
    })
  );
  beforeEach(() => {
    fixture = TestBed.createComponent(TankSurveyPdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
