import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { DailyApprovalPdfComponent } from "./daily-approval-pdf.component"
describe("DailyApprovalPdfComponent", () => {
  let component: DailyApprovalPdfComponent;
  let fixture: ComponentFixture<DailyApprovalPdfComponent>;
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
    imports: [DailyApprovalPdfComponent],
}).compileComponents();
    })
  );
  beforeEach(() => {
    fixture = TestBed.createComponent(DailyApprovalPdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
