import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelFormDialogComponent } from './cancel-form-dialog.component';

describe('FormDialogComponent', () => {
  let component: CancelFormDialogComponent;
  let fixture: ComponentFixture<CancelFormDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [CancelFormDialogComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CancelFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
