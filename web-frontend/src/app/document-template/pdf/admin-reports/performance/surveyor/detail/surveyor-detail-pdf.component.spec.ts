import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { SurveyorDetailPerformancePdfComponent } from "./surveyor-detail-pdf.component"
describe("SurveyorDetailPerformancePdfComponent", () => {
  let component: SurveyorDetailPerformancePdfComponent;
  let fixture: ComponentFixture<SurveyorDetailPerformancePdfComponent>;
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
    imports: [SurveyorDetailPerformancePdfComponent],
}).compileComponents();
    })
  );
  beforeEach(() => {
    fixture = TestBed.createComponent(SurveyorDetailPerformancePdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
