import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { PeriodicTestDueExcelComponent } from "./periodic-test-excel.component"
describe("PeriodicTestDueExcelComponent", () => {
  let component: PeriodicTestDueExcelComponent;
  let fixture: ComponentFixture<PeriodicTestDueExcelComponent>;
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
    imports: [PeriodicTestDueExcelComponent],
}).compileComponents();
    })
  );
  beforeEach(() => {
    fixture = TestBed.createComponent(PeriodicTestDueExcelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
