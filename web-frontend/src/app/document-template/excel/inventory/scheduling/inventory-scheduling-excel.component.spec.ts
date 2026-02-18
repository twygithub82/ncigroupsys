import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { InventorySchedulingExcelComponent } from "./inventory-scheduling-excel.component"
describe("InventorySchedulingExcelComponent", () => {
  let component: InventorySchedulingExcelComponent;
  let fixture: ComponentFixture<InventorySchedulingExcelComponent>;
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
    imports: [InventorySchedulingExcelComponent],
}).compileComponents();
    })
  );
  beforeEach(() => {
    fixture = TestBed.createComponent(InventorySchedulingExcelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
