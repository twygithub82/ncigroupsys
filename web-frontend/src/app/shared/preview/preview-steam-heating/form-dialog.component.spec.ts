import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SteamHeatingFormDialogComponent_View } from './form-dialog.component';

describe('SteamHeatingFormDialogComponent_View', () => {
  let component: SteamHeatingFormDialogComponent_View;
  let fixture: ComponentFixture<SteamHeatingFormDialogComponent_View>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [SteamHeatingFormDialogComponent_View]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SteamHeatingFormDialogComponent_View);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
