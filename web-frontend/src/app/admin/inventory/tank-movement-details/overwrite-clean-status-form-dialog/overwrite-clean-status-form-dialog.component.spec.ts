import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OverwriteCleanStatusFormDialogComponent } from './overwrite-clean-status-form-dialog.component';

describe('OverwriteCleanStatusFormDialogComponent', () => {
  let component: OverwriteCleanStatusFormDialogComponent;
  let fixture: ComponentFixture<OverwriteCleanStatusFormDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [OverwriteCleanStatusFormDialogComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OverwriteCleanStatusFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
