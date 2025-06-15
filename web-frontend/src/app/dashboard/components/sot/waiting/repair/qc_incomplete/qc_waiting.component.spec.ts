import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { RepairQCWaitingComponent } from "./qc_waiting.component";
describe("RepairQCWaitingComponent", () => {
  let component: RepairQCWaitingComponent;
  let fixture: ComponentFixture<RepairQCWaitingComponent>;
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
    imports: [RepairQCWaitingComponent],
}).compileComponents();
    })
  );
  beforeEach(() => {
    fixture = TestBed.createComponent(RepairQCWaitingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
