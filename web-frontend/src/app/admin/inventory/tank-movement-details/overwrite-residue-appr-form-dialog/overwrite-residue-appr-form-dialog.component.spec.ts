import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OverwriteResidueApprovalFormDialogComponent } from './overwrite-residue-appr-form-dialog.component';

describe('OverwriteResidueApprovalFormDialogComponent', () => {
  let component: OverwriteResidueApprovalFormDialogComponent;
  let fixture: ComponentFixture<OverwriteResidueApprovalFormDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [OverwriteResidueApprovalFormDialogComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OverwriteResidueApprovalFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
