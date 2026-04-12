import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { DailyQCDetailExcelComponent } from "./daily-qc-detail-excel.component"
describe("DailyQCDetailExcelComponent", () => {
  let component: DailyQCDetailExcelComponent;
  let fixture: ComponentFixture<DailyQCDetailExcelComponent>;
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
    imports: [DailyQCDetailExcelComponent],
}).compileComponents();
    })
  );
  beforeEach(() => {
    fixture = TestBed.createComponent(DailyQCDetailExcelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
