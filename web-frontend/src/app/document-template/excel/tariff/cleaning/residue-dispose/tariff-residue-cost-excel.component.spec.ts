import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { TariffCleaningCostPdfComponent } from "./tariff-cleaning-cost-pdf.component"
describe("TariffCleaningCostPdfComponent", () => {
  let component: TariffCleaningCostPdfComponent;
  let fixture: ComponentFixture<TariffCleaningCostPdfComponent>;
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
    imports: [TariffCleaningCostPdfComponent],
}).compileComponents();
    })
  );
  beforeEach(() => {
    fixture = TestBed.createComponent(TariffCleaningCostPdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
