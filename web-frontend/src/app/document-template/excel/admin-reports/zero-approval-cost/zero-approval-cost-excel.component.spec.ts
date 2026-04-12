import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { ZeroApprovalCostExcelComponent } from "./zero-approval-cost-excel.component";
describe("ZeroApprovalCostExcelComponent", () => {
  let component: ZeroApprovalCostExcelComponent;
  let fixture: ComponentFixture<ZeroApprovalCostExcelComponent>;
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
    imports: [ZeroApprovalCostExcelComponent],
}).compileComponents();
    })
  );
  beforeEach(() => {
    fixture = TestBed.createComponent(ZeroApprovalCostExcelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
