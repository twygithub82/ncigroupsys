import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { PackageLabourCostExcelComponent } from "./package-labour-cost-excel.component"
describe("PackageLabourCostExcelComponent", () => {
  let component: PackageLabourCostExcelComponent;
  let fixture: ComponentFixture<PackageLabourCostExcelComponent>;
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
    imports: [PackageLabourCostExcelComponent],
}).compileComponents();
    })
  );
  beforeEach(() => {
    fixture = TestBed.createComponent(PackageLabourCostExcelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
