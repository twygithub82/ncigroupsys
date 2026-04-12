import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { SteamPerformanceDetailExcelComponent } from "./steam-detail-excel.component";
describe("SteamPerformanceDetailExcelComponent", () => {
  let component: SteamPerformanceDetailExcelComponent;
  let fixture: ComponentFixture<SteamPerformanceDetailExcelComponent>;
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
    imports: [SteamPerformanceDetailExcelComponent],
}).compileComponents();
    })
  );
  beforeEach(() => {
    fixture = TestBed.createComponent(SteamPerformanceDetailExcelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
