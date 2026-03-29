import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TwoFADialogComponent } from './twofa-dialog.component';

describe('TwoFADialogComponent', () => {
  let component: TwoFADialogComponent;
  let fixture: ComponentFixture<TwoFADialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [TwoFADialogComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TwoFADialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
