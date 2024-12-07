import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPurposeFormDialogComponent } from './add-purpose-form-dialog.component';

describe('AddPurposeFormDialogComponent', () => {
  let component: AddPurposeFormDialogComponent;
  let fixture: ComponentFixture<AddPurposeFormDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [AddPurposeFormDialogComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPurposeFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
