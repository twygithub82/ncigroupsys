import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { PackageCleaningCostExcelComponent } from "./package-cleaning-cost-excel.component"
describe("PackageCleaningCostExcelComponent", () => {
  let component: PackageCleaningCostExcelComponent;
  let fixture: ComponentFixture<PackageCleaningCostExcelComponent>;
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
    imports: [PackageCleaningCostExcelComponent],
}).compileComponents();
    })
  );
  beforeEach(() => {
    fixture = TestBed.createComponent(PackageCleaningCostExcelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
