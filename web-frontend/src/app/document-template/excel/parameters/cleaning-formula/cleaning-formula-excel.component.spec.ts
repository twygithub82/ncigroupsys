import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { CleaningFormulaExcelComponent } from "./cleaning-formula-excel.component"
describe("CleaningFormulaExcelComponent", () => {
  let component: CleaningFormulaExcelComponent;
  let fixture: ComponentFixture<CleaningFormulaExcelComponent>;
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
    imports: [CleaningFormulaExcelComponent],
}).compileComponents();
    })
  );
  beforeEach(() => {
    fixture = TestBed.createComponent(CleaningFormulaExcelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
