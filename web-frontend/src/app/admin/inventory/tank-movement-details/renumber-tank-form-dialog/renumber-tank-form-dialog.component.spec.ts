import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RenumberTankFormDialogComponent } from './renumber-tank-form-dialog.component';

describe('RenumberTankFormDialogComponent', () => {
  let component: RenumberTankFormDialogComponent;
  let fixture: ComponentFixture<RenumberTankFormDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [RenumberTankFormDialogComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RenumberTankFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
