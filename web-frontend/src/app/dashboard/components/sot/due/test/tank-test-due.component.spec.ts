import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { TankTestDueComponent } from "./tank-test-due.component";
describe("TankTestDueComponent", () => {
  let component: TankTestDueComponent;
  let fixture: ComponentFixture<TankTestDueComponent>;
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
    imports: [TankTestDueComponent],
}).compileComponents();
    })
  );
  beforeEach(() => {
    fixture = TestBed.createComponent(TankTestDueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
