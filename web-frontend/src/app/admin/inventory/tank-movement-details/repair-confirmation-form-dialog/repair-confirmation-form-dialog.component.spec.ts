import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepairConfirmationFormDialogComponent } from './repair-confirmation-form-dialog.component';

describe('RepairConfirmationFormDialogComponent', () => {
  let component: RepairConfirmationFormDialogComponent;
  let fixture: ComponentFixture<RepairConfirmationFormDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [RepairConfirmationFormDialogComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RepairConfirmationFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
