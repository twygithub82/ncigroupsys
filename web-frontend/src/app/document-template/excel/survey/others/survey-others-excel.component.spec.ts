import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { SurveyOthersExcelComponent } from "./survey-others-excel.component"
describe("SurveyOthersExcelComponent", () => {
  let component: SurveyOthersExcelComponent;
  let fixture: ComponentFixture<SurveyOthersExcelComponent>;
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
    imports: [SurveyOthersExcelComponent],
}).compileComponents();
    })
  );
  beforeEach(() => {
    fixture = TestBed.createComponent(SurveyOthersExcelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
