import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { InGateMappingPdfComponent } from "./in-gate-mapping-pdf.component";
describe("InGateMappingPdfComponent", () => {
  let component: InGateMappingPdfComponent;
  let fixture: ComponentFixture<InGateMappingPdfComponent>;
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
    imports: [InGateMappingPdfComponent],
}).compileComponents();
    })
  );
  beforeEach(() => {
    fixture = TestBed.createComponent(InGateMappingPdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
