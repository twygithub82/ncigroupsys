import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { InventoryYearlySalesReportDetailsPdfComponent } from "./inventory-sales-details-pdf.component";
describe("InventoryYearlySalesReportDetailsPdfComponent", () => {
  let component: InventoryYearlySalesReportDetailsPdfComponent;
  let fixture: ComponentFixture<InventoryYearlySalesReportDetailsPdfComponent>;
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
    imports: [InventoryYearlySalesReportDetailsPdfComponent],
}).compileComponents();
    })
  );
  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryYearlySalesReportDetailsPdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
