import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { OutGateSurveyWaitingComponent } from "./out_gate_survey_waiting.component";
describe("OutGateSurveyWaitingComponent", () => {
  let component: OutGateSurveyWaitingComponent;
  let fixture: ComponentFixture<OutGateSurveyWaitingComponent>;
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
    imports: [OutGateSurveyWaitingComponent],
}).compileComponents();
    })
  );
  beforeEach(() => {
    fixture = TestBed.createComponent(OutGateSurveyWaitingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
