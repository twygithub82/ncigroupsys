import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { PackageResidueCostExcelComponent } from "./package-residue-cost-excel.component"
describe("PackageResidueCostExcelComponent", () => {
  let component: PackageResidueCostExcelComponent;
  let fixture: ComponentFixture<PackageResidueCostExcelComponent>;
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
    imports: [PackageResidueCostExcelComponent],
}).compileComponents();
    })
  );
  beforeEach(() => {
    fixture = TestBed.createComponent(PackageResidueCostExcelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
