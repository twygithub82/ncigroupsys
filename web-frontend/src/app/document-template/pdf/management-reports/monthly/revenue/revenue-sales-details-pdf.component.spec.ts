import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { InventoryMonthlySalesReportDetailsPdfComponent } from "./inventory-sales-details-pdf.component";
describe("InventoryMonthlySalesReportDetailsPdfComponent", () => {
  let component: InventoryMonthlySalesReportDetailsPdfComponent;
  let fixture: ComponentFixture<InventoryMonthlySalesReportDetailsPdfComponent>;
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
    imports: [InventoryMonthlySalesReportDetailsPdfComponent],
}).compileComponents();
    })
  );
  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryMonthlySalesReportDetailsPdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
