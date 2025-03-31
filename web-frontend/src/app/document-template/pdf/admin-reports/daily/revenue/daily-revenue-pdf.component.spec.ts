import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { DailyRevenuePdfComponent } from "./daily-revenue-pdf.component"
describe("DailyRevenuePdfComponent", () => {
  let component: DailyRevenuePdfComponent;
  let fixture: ComponentFixture<DailyRevenuePdfComponent>;
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
    imports: [DailyRevenuePdfComponent],
}).compileComponents();
    })
  );
  beforeEach(() => {
    fixture = TestBed.createComponent(DailyRevenuePdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
