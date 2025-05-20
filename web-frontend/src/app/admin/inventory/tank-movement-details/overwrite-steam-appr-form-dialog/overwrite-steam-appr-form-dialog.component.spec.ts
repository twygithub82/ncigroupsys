import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OverwriteSteamingApprovalFormDialogComponent } from './overwrite-steam-appr-form-dialog.component';

describe('OverwriteSteamingApprovalFormDialogComponent', () => {
  let component: OverwriteSteamingApprovalFormDialogComponent;
  let fixture: ComponentFixture<OverwriteSteamingApprovalFormDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [OverwriteSteamingApprovalFormDialogComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OverwriteSteamingApprovalFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
