import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { BilingBranchExcelComponent } from "./billing-branch-excel.component"
describe("BilingBranchExcelComponent", () => {
  let component: BilingBranchExcelComponent;
  let fixture: ComponentFixture<BilingBranchExcelComponent>;
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
    imports: [BilingBranchExcelComponent],
}).compileComponents();
    })
  );
  beforeEach(() => {
    fixture = TestBed.createComponent(BilingBranchExcelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
