import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { CleaningWaitingComponent } from "./cleaning_waiting.component";
describe("CleaningWaitingComponent", () => {
  let component: CleaningWaitingComponent;
  let fixture: ComponentFixture<CleaningWaitingComponent>;
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
    imports: [CleaningWaitingComponent],
}).compileComponents();
    })
  );
  beforeEach(() => {
    fixture = TestBed.createComponent(CleaningWaitingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
