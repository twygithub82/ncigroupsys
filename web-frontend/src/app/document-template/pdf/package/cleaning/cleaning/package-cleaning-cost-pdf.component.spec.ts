import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { PackageCleaningCostPdfComponent } from "./package-cleaning-cost-pdf.component"
describe("PackageCleaningCostPdfComponent", () => {
  let component: PackageCleaningCostPdfComponent;
  let fixture: ComponentFixture<PackageCleaningCostPdfComponent>;
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
    imports: [PackageCleaningCostPdfComponent],
}).compileComponents();
    })
  );
  beforeEach(() => {
    fixture = TestBed.createComponent(PackageCleaningCostPdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
