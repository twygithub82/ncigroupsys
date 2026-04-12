import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { PackageBufferCleaningCostPdfComponent } from "./package-buffer-cleaning-cost-pdf.component"
describe("PackageBufferCleaningCostPdfComponent", () => {
  let component: PackageBufferCleaningCostPdfComponent;
  let fixture: ComponentFixture<PackageBufferCleaningCostPdfComponent>;
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
    imports: [PackageBufferCleaningCostPdfComponent],
}).compileComponents();
    })
  );
  beforeEach(() => {
    fixture = TestBed.createComponent(PackageBufferCleaningCostPdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
