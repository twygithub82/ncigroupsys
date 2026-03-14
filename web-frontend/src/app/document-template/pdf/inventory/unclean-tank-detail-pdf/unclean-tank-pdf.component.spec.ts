import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { UncleanTankDetailInventoryPdfComponent } from "./unclean-tank-pdf.component"
describe("UncleanTankDetailInventoryPdfComponent", () => {
  let component: UncleanTankDetailInventoryPdfComponent;
  let fixture: ComponentFixture<UncleanTankDetailInventoryPdfComponent>;
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
    imports: [UncleanTankDetailInventoryPdfComponent],
}).compileComponents();
    })
  );
  beforeEach(() => {
    fixture = TestBed.createComponent(UncleanTankDetailInventoryPdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
