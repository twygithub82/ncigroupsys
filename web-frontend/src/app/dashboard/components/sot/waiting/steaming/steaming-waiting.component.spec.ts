import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { TankInYardComponent } from "./tank-in-yard.component";
describe("TankInYardComponent", () => {
  let component: TankInYardComponent;
  let fixture: ComponentFixture<TankInYardComponent>;
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
    imports: [TankInYardComponent],
}).compileComponents();
    })
  );
  beforeEach(() => {
    fixture = TestBed.createComponent(TankInYardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
