import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { TankActivityReportExcelComponent } from "./activity-report-excel.component"
describe("TankActivityReportExcelComponent", () => {
  let component: TankActivityReportExcelComponent;
  let fixture: ComponentFixture<TankActivityReportExcelComponent>;
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
    imports: [TankActivityReportExcelComponent],
}).compileComponents();
    })
  );
  beforeEach(() => {
    fixture = TestBed.createComponent(TankActivityReportExcelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
