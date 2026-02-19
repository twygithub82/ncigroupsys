import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { InventoryBookingExcelComponent } from "./inventory-booking-excel.component"
describe("InventoryBookingExcelComponent", () => {
  let component: InventoryBookingExcelComponent;
  let fixture: ComponentFixture<InventoryBookingExcelComponent>;
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
    imports: [InventoryBookingExcelComponent],
}).compileComponents();
    })
  );
  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryBookingExcelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
