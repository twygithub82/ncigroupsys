import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { SchedulingPdfComponent } from "./scheduling-report-pdf.component";
describe("SchedulingPdfComponent", () => {
  let component: SchedulingPdfComponent;
  let fixture: ComponentFixture<SchedulingPdfComponent>;
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
    imports: [SchedulingPdfComponent],
}).compileComponents();
    })
  );
  beforeEach(() => {
    fixture = TestBed.createComponent(SchedulingPdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
