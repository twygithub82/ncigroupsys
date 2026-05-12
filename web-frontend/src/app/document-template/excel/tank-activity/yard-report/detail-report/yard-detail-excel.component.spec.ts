import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { YardDetailExcelComponent } from "./yard-detail-excel.component"
describe("YardDetailExcelComponent", () => {
  let component: YardDetailExcelComponent;
  let fixture: ComponentFixture<YardDetailExcelComponent>;
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
    imports: [YardDetailExcelComponent],
}).compileComponents();
    })
  );
  beforeEach(() => {
    fixture = TestBed.createComponent(YardDetailExcelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
