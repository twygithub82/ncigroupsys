import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OverwriteJobNoFormDialogComponent } from './overwrite-job-no-form-dialog.component';

describe('OverwriteJobNoFormDialogComponent', () => {
  let component: OverwriteJobNoFormDialogComponent;
  let fixture: ComponentFixture<OverwriteJobNoFormDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [OverwriteJobNoFormDialogComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OverwriteJobNoFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
