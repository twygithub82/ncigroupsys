import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { CleaningKIVComponent } from "./cleaning_kiv.component";
describe("CleaningKIVComponent", () => {
  let component: CleaningKIVComponent;
  let fixture: ComponentFixture<CleaningKIVComponent>;
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
    imports: [CleaningKIVComponent],
}).compileComponents();
    })
  );
  beforeEach(() => {
    fixture = TestBed.createComponent(CleaningKIVComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
