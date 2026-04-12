import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { TransferLocationExcelComponent } from "./transfer-location-excel.component"
describe("TransferLocationExcelComponent", () => {
  let component: TransferLocationExcelComponent;
  let fixture: ComponentFixture<TransferLocationExcelComponent>;
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
    imports: [TransferLocationExcelComponent],
}).compileComponents();
    })
  );
  beforeEach(() => {
    fixture = TestBed.createComponent(TransferLocationExcelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
