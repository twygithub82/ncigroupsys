import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { CleanerPerformanceDetailExcelComponent } from "./cleaner-detail-excel.component"
describe("CleanerPerformanceDetailExcelComponent", () => {
  let component: CleanerPerformanceDetailExcelComponent;
  let fixture: ComponentFixture<CleanerPerformanceDetailExcelComponent>;
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
    imports: [CleanerPerformanceDetailExcelComponent],
}).compileComponents();
    })
  );
  beforeEach(() => {
    fixture = TestBed.createComponent(CleanerPerformanceDetailExcelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
