import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditGateDetailsFormDialogComponent } from './edit-gate-details-form-dialog.component';

describe('EditGateDetailsFormDialogComponent', () => {
  let component: EditGateDetailsFormDialogComponent;
  let fixture: ComponentFixture<EditGateDetailsFormDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [EditGateDetailsFormDialogComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditGateDetailsFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
