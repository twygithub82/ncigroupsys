import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { TariffLabourCostExcelComponent } from "./tariff-labour-cost-excel.component"
describe("TariffLabourCostExcelComponent", () => {
  let component: TariffLabourCostExcelComponent;
  let fixture: ComponentFixture<TariffLabourCostExcelComponent>;
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
    imports: [TariffLabourCostExcelComponent],
}).compileComponents();
    })
  );
  beforeEach(() => {
    fixture = TestBed.createComponent(TariffLabourCostExcelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
