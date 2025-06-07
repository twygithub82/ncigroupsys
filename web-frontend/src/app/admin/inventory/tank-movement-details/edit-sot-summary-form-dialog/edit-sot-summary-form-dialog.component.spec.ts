import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSotSummaryFormDialogComponent } from './edit-sot-summary-form-dialog.component';

describe('EditSotSummaryFormDialogComponent', () => {
  let component: EditSotSummaryFormDialogComponent;
  let fixture: ComponentFixture<EditSotSummaryFormDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [EditSotSummaryFormDialogComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditSotSummaryFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
