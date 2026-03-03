import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { SurveyOthersPdfComponent } from "./survey-others-pdf.component"
describe("SurveyOthersPdfComponent", () => {
  let component: SurveyOthersPdfComponent;
  let fixture: ComponentFixture<SurveyOthersPdfComponent>;
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
    imports: [SurveyOthersPdfComponent],
}).compileComponents();
    })
  );
  beforeEach(() => {
    fixture = TestBed.createComponent(SurveyOthersPdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
