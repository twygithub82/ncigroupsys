import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { PackageExclusiveSteamingCostPdfComponent } from "./package-exclusive-steaming-cost-pdf.component"
describe("PackageExclusiveSteamingCostPdfComponent", () => {
  let component: PackageExclusiveSteamingCostPdfComponent;
  let fixture: ComponentFixture<PackageExclusiveSteamingCostPdfComponent>;
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
    imports: [PackageExclusiveSteamingCostPdfComponent],
}).compileComponents();
    })
  );
  beforeEach(() => {
    fixture = TestBed.createComponent(PackageExclusiveSteamingCostPdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
