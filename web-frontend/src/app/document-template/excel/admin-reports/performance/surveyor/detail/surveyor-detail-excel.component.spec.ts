import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { SurveyorDetailPerformanceExcelComponent } from "./surveyor-detail-excel.component"
describe("SurveyorDetailPerformanceExcelComponent", () => {
  let component: SurveyorDetailPerformanceExcelComponent;
  let fixture: ComponentFixture<SurveyorDetailPerformanceExcelComponent>;
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
    imports: [SurveyorDetailPerformanceExcelComponent],
}).compileComponents();
    })
  );
  beforeEach(() => {
    fixture = TestBed.createComponent(SurveyorDetailPerformanceExcelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
