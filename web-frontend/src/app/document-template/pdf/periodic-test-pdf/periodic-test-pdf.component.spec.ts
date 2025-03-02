import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { PeriodicTestDuePdfComponent } from "./periodic-test-pdf.component"
describe("PeriodicTestDuePdfComponent", () => {
  let component: PeriodicTestDuePdfComponent;
  let fixture: ComponentFixture<PeriodicTestDuePdfComponent>;
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
    imports: [PeriodicTestDuePdfComponent],
}).compileComponents();
    })
  );
  beforeEach(() => {
    fixture = TestBed.createComponent(PeriodicTestDuePdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
