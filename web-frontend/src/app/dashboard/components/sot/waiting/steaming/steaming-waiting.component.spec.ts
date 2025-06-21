import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { SteamingWaitingComponent } from "./steaming-waiting.component";
describe("SteamingWaitingComponent", () => {
  let component: SteamingWaitingComponent;
  let fixture: ComponentFixture<SteamingWaitingComponent>;
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
    imports: [SteamingWaitingComponent],
}).compileComponents();
    })
  );
  beforeEach(() => {
    fixture = TestBed.createComponent(SteamingWaitingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
