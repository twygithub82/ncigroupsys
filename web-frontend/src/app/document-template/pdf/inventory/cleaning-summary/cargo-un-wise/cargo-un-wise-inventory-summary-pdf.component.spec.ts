import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { CargoUNWiseInventorySummaryPdfComponent } from "./cargo-un-wise-inventory-summary-pdf.component"
describe("CargoUNWiseInventorySummaryPdfComponent", () => {
  let component: CargoUNWiseInventorySummaryPdfComponent;
  let fixture: ComponentFixture<CargoUNWiseInventorySummaryPdfComponent>;
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
    imports: [CargoUNWiseInventorySummaryPdfComponent],
}).compileComponents();
    })
  );
  beforeEach(() => {
    fixture = TestBed.createComponent(CargoUNWiseInventorySummaryPdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
