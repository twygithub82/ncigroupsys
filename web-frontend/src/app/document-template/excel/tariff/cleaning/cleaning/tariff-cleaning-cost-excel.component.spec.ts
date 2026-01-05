import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { TariffCleaningCostExcelComponent } from "./tariff-cleaning-cost-excel.component"
describe("TariffCleaningCostExcelComponent", () => {
  let component: TariffCleaningCostExcelComponent;
  let fixture: ComponentFixture<TariffCleaningCostExcelComponent>;
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
    imports: [TariffCleaningCostExcelComponent],
}).compileComponents();
    })
  );
  beforeEach(() => {
    fixture = TestBed.createComponent(TariffCleaningCostExcelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
