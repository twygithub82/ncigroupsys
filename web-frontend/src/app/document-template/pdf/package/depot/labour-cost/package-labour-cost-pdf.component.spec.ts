import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { PackageLabourCostPdfComponent } from "./package-labour-cost-pdf.component"
describe("PackageLabourCostPdfComponent", () => {
  let component: PackageLabourCostPdfComponent;
  let fixture: ComponentFixture<PackageLabourCostPdfComponent>;
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
    imports: [PackageLabourCostPdfComponent],
}).compileComponents();
    })
  );
  beforeEach(() => {
    fixture = TestBed.createComponent(PackageLabourCostPdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
