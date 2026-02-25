import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { PackageRepairCostExcelComponent } from "./package-repair-cost-excel.component"
describe("PackageRepairCostExcelComponent", () => {
  let component: PackageRepairCostExcelComponent;
  let fixture: ComponentFixture<PackageRepairCostExcelComponent>;
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
    imports: [PackageRepairCostExcelComponent],
}).compileComponents();
    })
  );
  beforeEach(() => {
    fixture = TestBed.createComponent(PackageRepairCostExcelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
