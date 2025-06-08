import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { Test1Component } from "./test1.component";
describe("Test1Component", () => {
  let component: Test1Component;
  let fixture: ComponentFixture<Test1Component>;
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
    imports: [Test1Component],
}).compileComponents();
    })
  );
  beforeEach(() => {
    fixture = TestBed.createComponent(Test1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
