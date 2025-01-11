import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SteamTempFormDialogComponent } from './steam-temp-form-dialog.component';

describe('SteamTempFormDialogComponent', () => {
  let component: SteamTempFormDialogComponent;
  let fixture: ComponentFixture<SteamTempFormDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [SteamTempFormDialogComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SteamTempFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
