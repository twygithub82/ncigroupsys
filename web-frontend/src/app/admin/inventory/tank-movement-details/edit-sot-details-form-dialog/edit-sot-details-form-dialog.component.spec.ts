import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSotDetailsFormDialogComponent } from './edit-sot-details-form-dialog.component';

describe('EditSotDetailsFormDialogComponent', () => {
  let component: EditSotDetailsFormDialogComponent;
  let fixture: ComponentFixture<EditSotDetailsFormDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [EditSotDetailsFormDialogComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditSotDetailsFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
