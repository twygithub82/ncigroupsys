import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { ConsolidatedWaitingComponent } from "./consolidated_waiting.component";
describe("ConsolidatedWaitingComponent", () => {
  let component: ConsolidatedWaitingComponent;
  let fixture: ComponentFixture<ConsolidatedWaitingComponent>;
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
    imports: [ConsolidatedWaitingComponent],
}).compileComponents();
    })
  );
  beforeEach(() => {
    fixture = TestBed.createComponent(ConsolidatedWaitingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
