import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { PackageBufferCleaningCostExcelComponent } from "./package-buffer-cleaning-cost-excel.component"
describe("PackageBufferCleaningCostExcelComponent", () => {
  let component: PackageBufferCleaningCostExcelComponent;
  let fixture: ComponentFixture<PackageBufferCleaningCostExcelComponent>;
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
    imports: [PackageBufferCleaningCostExcelComponent],
}).compileComponents();
    })
  );
  beforeEach(() => {
    fixture = TestBed.createComponent(PackageBufferCleaningCostExcelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
