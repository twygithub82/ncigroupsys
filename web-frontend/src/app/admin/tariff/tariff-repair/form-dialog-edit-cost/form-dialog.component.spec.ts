import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormDialogComponent_Edit_Cost } from './form-dialog.component';

describe('FormDialogComponent', () => {
  let component: FormDialogComponent_Edit_Cost;
  let fixture: ComponentFixture<FormDialogComponent_Edit_Cost>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [FormDialogComponent_Edit_Cost]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormDialogComponent_Edit_Cost);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
