import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { GateInPublishWaitingComponent } from "./gatein_publish_waiting.component";
describe("GateInPublishWaitingComponent", () => {
  let component: GateInPublishWaitingComponent;
  let fixture: ComponentFixture<GateInPublishWaitingComponent>;
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
    imports: [GateInPublishWaitingComponent],
}).compileComponents();
    })
  );
  beforeEach(() => {
    fixture = TestBed.createComponent(GateInPublishWaitingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
