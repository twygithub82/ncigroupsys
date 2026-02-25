import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { PackageSteamingCostExcelComponent } from "./package-steaming-cost-excel.component"
describe("PackageSteamingCostExcelComponent", () => {
  let component: PackageSteamingCostExcelComponent;
  let fixture: ComponentFixture<PackageSteamingCostExcelComponent>;
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
    imports: [PackageSteamingCostExcelComponent],
}).compileComponents();
    })
  );
  beforeEach(() => {
    fixture = TestBed.createComponent(PackageSteamingCostExcelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
