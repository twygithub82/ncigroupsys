import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { SteamHeatingPdfComponent } from "./steam-heating-pdf.component";
describe("SteamHeatingPdfComponent", () => {
  let component: SteamHeatingPdfComponent;
  let fixture: ComponentFixture<SteamHeatingPdfComponent>;
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
    imports: [SteamHeatingPdfComponent],
}).compileComponents();
    })
  );
  beforeEach(() => {
    fixture = TestBed.createComponent(SteamHeatingPdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
