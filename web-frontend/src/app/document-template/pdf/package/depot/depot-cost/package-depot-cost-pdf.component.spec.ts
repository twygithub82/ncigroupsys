import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { PackageDepotCostPdfComponent } from "./package-depot-cost-pdf.component"
describe("PackageDepotCostPdfComponent", () => {
  let component: PackageDepotCostPdfComponent;
  let fixture: ComponentFixture<PackageDepotCostPdfComponent>;
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
    imports: [PackageDepotCostPdfComponent],
}).compileComponents();
    })
  );
  beforeEach(() => {
    fixture = TestBed.createComponent(PackageDepotCostPdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
