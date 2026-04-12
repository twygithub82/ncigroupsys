import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { CleaningDetailInventoryExcelComponent } from "./cleaning-detail-excel.component"
describe("CleaningDetailInventoryExcelComponent", () => {
  let component: CleaningDetailInventoryExcelComponent;
  let fixture: ComponentFixture<CleaningDetailInventoryExcelComponent>;
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
    imports: [CleaningDetailInventoryExcelComponent],
}).compileComponents();
    })
  );
  beforeEach(() => {
    fixture = TestBed.createComponent(CleaningDetailInventoryExcelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
