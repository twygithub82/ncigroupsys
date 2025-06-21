import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { ReleaseWaitingComponent } from "./release-waiting.component";
describe("ReleaseWaitingComponent", () => {
  let component: ReleaseWaitingComponent;
  let fixture: ComponentFixture<ReleaseWaitingComponent>;
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
    imports: [ReleaseWaitingComponent],
}).compileComponents();
    })
  );
  beforeEach(() => {
    fixture = TestBed.createComponent(ReleaseWaitingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
