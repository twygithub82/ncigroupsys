import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TankNoteFormDialogComponent } from './tank-note-form-dialog.component';

describe('TankNoteFormDialogComponent', () => {
  let component: TankNoteFormDialogComponent;
  let fixture: ComponentFixture<TankNoteFormDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [TankNoteFormDialogComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TankNoteFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
