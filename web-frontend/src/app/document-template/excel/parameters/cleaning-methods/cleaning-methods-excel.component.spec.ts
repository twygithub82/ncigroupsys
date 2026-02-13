import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { CleaningMethodsExcelComponent } from "./cleaning-methods-excel.component"
describe("CleaningMethodsExcelComponent", () => {
  let component: CleaningMethodsExcelComponent;
  let fixture: ComponentFixture<CleaningMethodsExcelComponent>;
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
    imports: [CleaningMethodsExcelComponent],
}).compileComponents();
    })
  );
  beforeEach(() => {
    fixture = TestBed.createComponent(CleaningMethodsExcelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
