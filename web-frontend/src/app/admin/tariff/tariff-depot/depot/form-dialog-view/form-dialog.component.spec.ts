import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormDialogComponent_View } from './form-dialog.component';

describe('FormDialogComponent', () => {
  let component: FormDialogComponent_View;
  let fixture: ComponentFixture<FormDialogComponent_View>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [FormDialogComponent_View]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormDialogComponent_View);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
