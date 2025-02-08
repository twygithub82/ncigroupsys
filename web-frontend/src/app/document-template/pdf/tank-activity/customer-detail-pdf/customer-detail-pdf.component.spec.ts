import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { YardDetailPdfComponent } from "./yard-detail-pdf.component"
describe("YardDetailPdfComponent", () => {
  let component: YardDetailPdfComponent;
  let fixture: ComponentFixture<YardDetailPdfComponent>;
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
    imports: [YardDetailPdfComponent],
}).compileComponents();
    })
  );
  beforeEach(() => {
    fixture = TestBed.createComponent(YardDetailPdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
