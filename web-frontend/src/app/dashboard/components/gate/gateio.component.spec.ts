import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { DashboardGateIOComponent } from "./gateio.component";
describe("DashboardGateIOComponent", () => {
  let component: DashboardGateIOComponent;
  let fixture: ComponentFixture<DashboardGateIOComponent>;
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
    imports: [DashboardGateIOComponent],
}).compileComponents();
    })
  );
  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardGateIOComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
