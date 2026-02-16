import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { CleaningCategoryExcelComponent } from "./cleaning-category-excel.component"
describe("CleaningCategoryExcelComponent", () => {
  let component: CleaningCategoryExcelComponent;
  let fixture: ComponentFixture<CleaningCategoryExcelComponent>;
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
    imports: [CleaningCategoryExcelComponent],
}).compileComponents();
    })
  );
  beforeEach(() => {
    fixture = TestBed.createComponent(CleaningCategoryExcelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
