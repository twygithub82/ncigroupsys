import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TankInfoFormDialogComponent } from './tank-info-form-dialog.component';

describe('TankInfoFormDialogComponent', () => {
  let component: TankInfoFormDialogComponent;
  let fixture: ComponentFixture<TankInfoFormDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [TankInfoFormDialogComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TankInfoFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
