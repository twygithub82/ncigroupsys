import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { ResidueDisposalPdfComponent } from "./residue-disposal-pdf.component";
describe("ResidueDisposalPdfComponent", () => {
  let component: ResidueDisposalPdfComponent;
  let fixture: ComponentFixture<ResidueDisposalPdfComponent>;
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
    imports: [ResidueDisposalPdfComponent],
}).compileComponents();
    })
  );
  beforeEach(() => {
    fixture = TestBed.createComponent(ResidueDisposalPdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
