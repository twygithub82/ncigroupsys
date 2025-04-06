import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OverwriteCleaningApprovalFormDialogComponent } from './overwrite-clean-appr-form-dialog.component';

describe('OverwriteCleaningApprovalFormDialogComponent', () => {
  let component: OverwriteCleaningApprovalFormDialogComponent;
  let fixture: ComponentFixture<OverwriteCleaningApprovalFormDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [OverwriteCleaningApprovalFormDialogComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OverwriteCleaningApprovalFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
