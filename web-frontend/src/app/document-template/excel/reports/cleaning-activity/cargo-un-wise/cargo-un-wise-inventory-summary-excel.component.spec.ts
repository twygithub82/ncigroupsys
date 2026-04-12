import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { CargoUNWiseInventorySummaryExcelComponent } from "./cargo-un-wise-inventory-summary-excel.component"
describe("CargoUNWiseInventorySummaryExcelComponent", () => {
  let component: CargoUNWiseInventorySummaryExcelComponent;
  let fixture: ComponentFixture<CargoUNWiseInventorySummaryExcelComponent>;
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
    imports: [CargoUNWiseInventorySummaryExcelComponent],
}).compileComponents();
    })
  );
  beforeEach(() => {
    fixture = TestBed.createComponent(CargoUNWiseInventorySummaryExcelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
