import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmptyFormConfirmationDialogComponent } from './confirmation-dialog.component';

describe('EmptyFormConfirmationDialogComponent', () => {
  let component: EmptyFormConfirmationDialogComponent;
  let fixture: ComponentFixture<EmptyFormConfirmationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [EmptyFormConfirmationDialogComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmptyFormConfirmationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
