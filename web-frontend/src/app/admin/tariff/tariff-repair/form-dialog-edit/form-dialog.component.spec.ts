import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormDialogComponent_Edit } from './form-dialog.component';

describe('FormDialogComponent', () => {
  let component: FormDialogComponent_Edit;
  let fixture: ComponentFixture<FormDialogComponent_Edit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [FormDialogComponent_Edit]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormDialogComponent_Edit);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
