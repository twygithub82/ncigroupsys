import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { InspectionMappingPdfComponent } from "./inspection-mapping-pdf.component";
describe("InspectionMappingPdfComponent", () => {
  let component: InspectionMappingPdfComponent;
  let fixture: ComponentFixture<InspectionMappingPdfComponent>;
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
    imports: [InspectionMappingPdfComponent],
}).compileComponents();
    })
  );
  beforeEach(() => {
    fixture = TestBed.createComponent(InspectionMappingPdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
