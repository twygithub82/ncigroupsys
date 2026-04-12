import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { DailyApprovalExcelComponent } from "./daily-approval-excel.component"
describe("DailyApprovalPdfComponent", () => {
  let component: DailyApprovalExcelComponent;
  let fixture: ComponentFixture<DailyApprovalExcelComponent>;
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
    imports: [DailyApprovalExcelComponent],
}).compileComponents();
    })
  );
  beforeEach(() => {
    fixture = TestBed.createComponent(DailyApprovalExcelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
