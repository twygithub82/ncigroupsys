import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmationRemarksFormDialogComponent } from './confirmation-remarks-form-dialog.component';

describe('ConfirmationRemarksFormDialogComponent', () => {
  let component: ConfirmationRemarksFormDialogComponent;
  let fixture: ComponentFixture<ConfirmationRemarksFormDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [ConfirmationRemarksFormDialogComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmationRemarksFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
