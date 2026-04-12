import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { InventoryMonthlySalesReportDetailsExcelComponent } from "./inventory-sales-details-excel.component";
describe("InventoryMonthlySalesReportDetailsExcelComponent", () => {
  let component: InventoryMonthlySalesReportDetailsExcelComponent;
  let fixture: ComponentFixture<InventoryMonthlySalesReportDetailsExcelComponent>;
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
    imports: [InventoryMonthlySalesReportDetailsExcelComponent],
}).compileComponents();
    })
  );
  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryMonthlySalesReportDetailsExcelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
