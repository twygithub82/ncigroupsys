import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { EirFormComponent } from "./eir-form.component";
describe("EirFormComponent", () => {
  let component: EirFormComponent;
  let fixture: ComponentFixture<EirFormComponent>;
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
    imports: [EirFormComponent],
}).compileComponents();
    })
  );
  beforeEach(() => {
    fixture = TestBed.createComponent(EirFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
