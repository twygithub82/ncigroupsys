import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { PackageDepotCostExcelComponent } from "./package-depot-cost-excel.component"
describe("PackageDepotCostExcelComponent", () => {
  let component: PackageDepotCostExcelComponent;
  let fixture: ComponentFixture<PackageDepotCostExcelComponent>;
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
    imports: [PackageDepotCostExcelComponent],
}).compileComponents();
    })
  );
  beforeEach(() => {
    fixture = TestBed.createComponent(PackageDepotCostExcelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
