import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { YardDetailInventoryPdfComponent } from "./yard-detail-pdf.component"
describe("YardDetailInventoryPdfComponent", () => {
  let component: YardDetailInventoryPdfComponent;
  let fixture: ComponentFixture<YardDetailInventoryPdfComponent>;
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
    imports: [YardDetailInventoryPdfComponent],
}).compileComponents();
    })
  );
  beforeEach(() => {
    fixture = TestBed.createComponent(YardDetailInventoryPdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
