import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { SteamEstimatePdfComponent } from "./steam-estimate-pdf.component";
describe("SteamEstimatePdfComponent", () => {
  let component: SteamEstimatePdfComponent;
  let fixture: ComponentFixture<SteamEstimatePdfComponent>;
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
    imports: [SteamEstimatePdfComponent],
}).compileComponents();
    })
  );
  beforeEach(() => {
    fixture = TestBed.createComponent(SteamEstimatePdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
