import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { PackageRepairCostPdfComponent } from "./package-repair-cost-pdf.component"
describe("PackageRepairCostPdfComponent", () => {
  let component: PackageRepairCostPdfComponent;
  let fixture: ComponentFixture<PackageRepairCostPdfComponent>;
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
    imports: [PackageRepairCostPdfComponent],
}).compileComponents();
    })
  );
  beforeEach(() => {
    fixture = TestBed.createComponent(PackageRepairCostPdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
