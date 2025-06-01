import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSotFormDialogComponent } from './edit-sot-form-dialog.component';

describe('EditSotFormDialogComponent', () => {
  let component: EditSotFormDialogComponent;
  let fixture: ComponentFixture<EditSotFormDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [EditSotFormDialogComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditSotFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
