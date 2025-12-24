import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { TariffRepairExcelComponent } from "./tariff-repair-excel.component"
describe("TariffRepairExcelComponent", () => {
  let component: TariffRepairExcelComponent;
  let fixture: ComponentFixture<TariffRepairExcelComponent>;
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
    imports: [TariffRepairExcelComponent],
}).compileComponents();
    })
  );
  beforeEach(() => {
    fixture = TestBed.createComponent(TariffRepairExcelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
