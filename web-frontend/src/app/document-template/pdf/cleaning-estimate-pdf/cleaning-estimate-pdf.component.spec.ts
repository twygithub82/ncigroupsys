import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { CleaningEstimatePdfComponent } from "./cleaning-estimate-pdf.component";
describe("CleaningEstimatePdfComponent", () => {
  let component: CleaningEstimatePdfComponent;
  let fixture: ComponentFixture<CleaningEstimatePdfComponent>;
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
    imports: [CleaningEstimatePdfComponent],
}).compileComponents();
    })
  );
  beforeEach(() => {
    fixture = TestBed.createComponent(CleaningEstimatePdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
