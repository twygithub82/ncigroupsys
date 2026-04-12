import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { PackageSteamingCostPdfComponent } from "./package-steaming-cost-pdf.component"
describe("PackageSteamingCostPdfComponent", () => {
  let component: PackageSteamingCostPdfComponent;
  let fixture: ComponentFixture<PackageSteamingCostPdfComponent>;
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
    imports: [PackageSteamingCostPdfComponent],
}).compileComponents();
    })
  );
  beforeEach(() => {
    fixture = TestBed.createComponent(PackageSteamingCostPdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
