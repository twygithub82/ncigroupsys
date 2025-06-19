import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { RepairEstimateWaitingComponent } from "./estimate_waiting.component";
describe("RepairEstimateWaitingComponent", () => {
  let component: RepairEstimateWaitingComponent;
  let fixture: ComponentFixture<RepairEstimateWaitingComponent>;
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
    imports: [RepairEstimateWaitingComponent],
}).compileComponents();
    })
  );
  beforeEach(() => {
    fixture = TestBed.createComponent(RepairEstimateWaitingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
