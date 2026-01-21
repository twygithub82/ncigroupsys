import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormDialogComponent_New } from './form-dialog.component';

describe('FormDialogComponent', () => {
  let component: FormDialogComponent_New;
  let fixture: ComponentFixture<FormDialogComponent_New>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [FormDialogComponent_New]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormDialogComponent_New);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
