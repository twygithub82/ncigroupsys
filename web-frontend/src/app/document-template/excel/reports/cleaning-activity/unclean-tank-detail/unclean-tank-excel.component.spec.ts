import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { UncleanTankDetailInventoryExcelComponent } from "./unclean-tank-excel.component"
describe("UncleanTankDetailInventoryExcelComponent", () => {
  let component: UncleanTankDetailInventoryExcelComponent;
  let fixture: ComponentFixture<UncleanTankDetailInventoryExcelComponent>;
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
    imports: [UncleanTankDetailInventoryExcelComponent],
}).compileComponents();
    })
  );
  beforeEach(() => {
    fixture = TestBed.createComponent(UncleanTankDetailInventoryExcelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
