import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { YearlyDetailExcelComponent } from "./yearly-summary-excel.component"
describe("YearlyDetailExcelComponent", () => {
  let component: YearlyDetailExcelComponent;
  let fixture: ComponentFixture<YearlyDetailExcelComponent>;
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
    imports: [YearlyDetailExcelComponent],
}).compileComponents();
    })
  );
  beforeEach(() => {
    fixture = TestBed.createComponent(YearlyDetailExcelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
