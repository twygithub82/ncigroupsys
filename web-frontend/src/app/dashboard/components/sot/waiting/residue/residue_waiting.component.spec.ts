import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { ResidueWaitingComponent } from "./residue_waiting.component";
describe("ResidueWaitingComponent", () => {
  let component: ResidueWaitingComponent;
  let fixture: ComponentFixture<ResidueWaitingComponent>;
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
    imports: [ResidueWaitingComponent],
}).compileComponents();
    })
  );
  beforeEach(() => {
    fixture = TestBed.createComponent(ResidueWaitingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
