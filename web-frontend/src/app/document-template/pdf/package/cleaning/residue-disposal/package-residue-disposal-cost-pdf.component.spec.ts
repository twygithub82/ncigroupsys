import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { PackageResidueDisposalCostPdfComponent } from "./package-residue-disposal-cost-pdf.component"
describe("PackageResidueDisposalCostPdfComponent", () => {
  let component: PackageResidueDisposalCostPdfComponent;
  let fixture: ComponentFixture<PackageResidueDisposalCostPdfComponent>;
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
    imports: [PackageResidueDisposalCostPdfComponent],
}).compileComponents();
    })
  );
  beforeEach(() => {
    fixture = TestBed.createComponent(PackageResidueDisposalCostPdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
