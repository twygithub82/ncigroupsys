import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { RepairCustomerApprovalWaitingComponent } from "./customer_approval_waiting.component";
describe("RepairCustomerApprovalWaitingComponent", () => {
  let component: RepairCustomerApprovalWaitingComponent;
  let fixture: ComponentFixture<RepairCustomerApprovalWaitingComponent>;
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
    imports: [RepairCustomerApprovalWaitingComponent],
}).compileComponents();
    })
  );
  beforeEach(() => {
    fixture = TestBed.createComponent(RepairCustomerApprovalWaitingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
