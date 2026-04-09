import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { TariffBufferCleaningCostExcelComponent } from "./tariff-buffer-cleaning-cost-excel.component"
describe("TariffBufferCleaningCostExcelComponent", () => {
  let component: TariffBufferCleaningCostExcelComponent;
  let fixture: ComponentFixture<TariffBufferCleaningCostExcelComponent>;
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
    imports: [TariffBufferCleaningCostExcelComponent],
}).compileComponents();
    })
  );
  beforeEach(() => {
    fixture = TestBed.createComponent(TariffBufferCleaningCostExcelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
