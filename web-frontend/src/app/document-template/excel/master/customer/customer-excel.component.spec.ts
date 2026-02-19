import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { CustomerExcelComponent } from "./customer-excel.component"
describe("CustomerExcelComponent", () => {
  let component: CustomerExcelComponent;
  let fixture: ComponentFixture<CustomerExcelComponent>;
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
    imports: [CustomerExcelComponent],
}).compileComponents();
    })
  );
  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerExcelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
