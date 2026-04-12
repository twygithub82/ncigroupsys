import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { SurveyPeriodExcelComponent } from "./survey-period-excel.component"
describe("SurveyPeriodExcelComponent", () => {
  let component: SurveyPeriodExcelComponent;
  let fixture: ComponentFixture<SurveyPeriodExcelComponent>;
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
    imports: [SurveyPeriodExcelComponent],
}).compileComponents();
    })
  );
  beforeEach(() => {
    fixture = TestBed.createComponent(SurveyPeriodExcelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
