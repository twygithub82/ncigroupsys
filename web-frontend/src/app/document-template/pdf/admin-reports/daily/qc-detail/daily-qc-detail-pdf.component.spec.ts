import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { DailyQCDetailPdfComponent } from "./daily-qc-detail-pdf.component"
describe("DailyQCDetailPdfComponent", () => {
  let component: DailyQCDetailPdfComponent;
  let fixture: ComponentFixture<DailyQCDetailPdfComponent>;
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
    imports: [DailyQCDetailPdfComponent],
}).compileComponents();
    })
  );
  beforeEach(() => {
    fixture = TestBed.createComponent(DailyQCDetailPdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
