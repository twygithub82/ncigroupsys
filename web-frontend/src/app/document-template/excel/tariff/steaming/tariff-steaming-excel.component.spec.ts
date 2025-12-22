import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { TariffSteamingExcelComponent } from "./tariff-steaming-excel.component"
describe("TariffSteamingExcelComponent", () => {
  let component: TariffSteamingExcelComponent;
  let fixture: ComponentFixture<TariffSteamingExcelComponent>;
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
    imports: [TariffSteamingExcelComponent],
}).compileComponents();
    })
  );
  beforeEach(() => {
    fixture = TestBed.createComponent(TariffSteamingExcelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
