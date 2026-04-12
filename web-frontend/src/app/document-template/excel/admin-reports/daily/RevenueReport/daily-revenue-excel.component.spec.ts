import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { DailyRevenueExcelComponent } from "./daily-revenue-excel.component"
describe("DailyRevenueExcelComponent", () => {
  let component: DailyRevenueExcelComponent;
  let fixture: ComponentFixture<DailyRevenueExcelComponent>;
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
    imports: [DailyRevenueExcelComponent],
}).compileComponents();
    })
  );
  beforeEach(() => {
    fixture = TestBed.createComponent(DailyRevenueExcelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
