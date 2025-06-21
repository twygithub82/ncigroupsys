import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { TankInSteamingComponent } from "./tank-in-steaming.component";
describe("TankInSteamingComponent", () => {
  let component: TankInSteamingComponent;
  let fixture: ComponentFixture<TankInSteamingComponent>;
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
    imports: [TankInSteamingComponent],
}).compileComponents();
    })
  );
  beforeEach(() => {
    fixture = TestBed.createComponent(TankInSteamingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
