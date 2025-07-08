import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResidueEstimateFormDialogComponent_View } from './form-dialog.component';

describe('ResidueEstimateFormDialogComponent_View', () => {
  let component: ResidueEstimateFormDialogComponent_View;
  let fixture: ComponentFixture<ResidueEstimateFormDialogComponent_View>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [ResidueEstimateFormDialogComponent_View]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResidueEstimateFormDialogComponent_View);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
