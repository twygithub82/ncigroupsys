import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { TariffRepairCostPdfComponent } from "./tariff-repair-cost-pdf.component"
describe("TariffRepairCostPdfComponent", () => {
  let component: TariffRepairCostPdfComponent;
  let fixture: ComponentFixture<TariffRepairCostPdfComponent>;
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
    imports: [TariffRepairCostPdfComponent],
}).compileComponents();
    })
  );
  beforeEach(() => {
    fixture = TestBed.createComponent(TariffRepairCostPdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
