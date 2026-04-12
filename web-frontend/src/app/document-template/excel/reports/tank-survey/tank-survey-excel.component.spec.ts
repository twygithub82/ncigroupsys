import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { TankSurveyExcelComponent } from "./tank-survey-excel.component"
describe("TankSurveyExcelComponent", () => {
  let component: TankSurveyExcelComponent;
  let fixture: ComponentFixture<TankSurveyExcelComponent>;
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
    imports: [TankSurveyExcelComponent],
}).compileComponents();
    })
  );
  beforeEach(() => {
    fixture = TestBed.createComponent(TankSurveyExcelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
