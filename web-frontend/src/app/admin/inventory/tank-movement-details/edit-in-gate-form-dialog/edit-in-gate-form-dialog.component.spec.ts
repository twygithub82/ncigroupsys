import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditInGateFormDialogComponent } from './edit-in-gate-form-dialog.component';

describe('EditInGateFormDialogComponent', () => {
  let component: EditInGateFormDialogComponent;
  let fixture: ComponentFixture<EditInGateFormDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [EditInGateFormDialogComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditInGateFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
