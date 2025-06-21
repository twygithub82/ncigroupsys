import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { GateInWaitingComponent } from "./gatein_waiting.component";
describe("GateInWaitingComponent", () => {
  let component: GateInWaitingComponent;
  let fixture: ComponentFixture<GateInWaitingComponent>;
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
    imports: [GateInWaitingComponent],
}).compileComponents();
    })
  );
  beforeEach(() => {
    fixture = TestBed.createComponent(GateInWaitingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
