import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { InGateSurveyWaitingComponent } from "./in_gate_survey_waiting.component";
describe("InGateSurveyWaitingComponent", () => {
  let component: InGateSurveyWaitingComponent;
  let fixture: ComponentFixture<InGateSurveyWaitingComponent>;
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
    imports: [InGateSurveyWaitingComponent],
}).compileComponents();
    })
  );
  beforeEach(() => {
    fixture = TestBed.createComponent(InGateSurveyWaitingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
