import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OverwriteRepairApprovalFormDialogComponent } from './overwrite-repair-appr-form-dialog.component';

describe('OverwriteRepairApprovalFormDialogComponent', () => {
  let component: OverwriteRepairApprovalFormDialogComponent;
  let fixture: ComponentFixture<OverwriteRepairApprovalFormDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [OverwriteRepairApprovalFormDialogComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OverwriteRepairApprovalFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
