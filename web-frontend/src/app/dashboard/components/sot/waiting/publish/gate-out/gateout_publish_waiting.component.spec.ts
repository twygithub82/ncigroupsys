import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { GateOutPublishWaitingComponent } from "./gateout_publish_waiting.component";
describe("GateOutPublishWaitingComponent", () => {
  let component: GateOutPublishWaitingComponent;
  let fixture: ComponentFixture<GateOutPublishWaitingComponent>;
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
    imports: [GateOutPublishWaitingComponent],
}).compileComponents();
    })
  );
  beforeEach(() => {
    fixture = TestBed.createComponent(GateOutPublishWaitingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
