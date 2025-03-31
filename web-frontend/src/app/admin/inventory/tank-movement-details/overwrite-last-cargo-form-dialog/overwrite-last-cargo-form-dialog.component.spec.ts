import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OverwriteLastCargoFormDialogComponent } from './overwrite-last-cargo-form-dialog.component';

describe('OverwriteLastCargoFormDialogComponent', () => {
  let component: OverwriteLastCargoFormDialogComponent;
  let fixture: ComponentFixture<OverwriteLastCargoFormDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [OverwriteLastCargoFormDialogComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OverwriteLastCargoFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
