import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SteamEstimateFormDialogComponent_View } from './form-dialog.component';

describe('SteamEstimateFormDialogComponent_View', () => {
  let component: SteamEstimateFormDialogComponent_View;
  let fixture: ComponentFixture<SteamEstimateFormDialogComponent_View>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [SteamEstimateFormDialogComponent_View]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SteamEstimateFormDialogComponent_View);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
