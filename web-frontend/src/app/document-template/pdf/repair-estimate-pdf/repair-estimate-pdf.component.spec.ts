import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { RepairEstimatePdfComponent } from "./repair-estimate-pdf.component";
describe("RepairEstimatePdfComponent", () => {
  let component: RepairEstimatePdfComponent;
  let fixture: ComponentFixture<RepairEstimatePdfComponent>;
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
    imports: [RepairEstimatePdfComponent],
}).compileComponents();
    })
  );
  beforeEach(() => {
    fixture = TestBed.createComponent(RepairEstimatePdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
