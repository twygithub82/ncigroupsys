import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OverwriteDepotCostFormDialogComponent } from './overwrite-depot-cost-form-dialog.component';

describe('OverwriteDepotCostFormDialogComponent', () => {
  let component: OverwriteDepotCostFormDialogComponent;
  let fixture: ComponentFixture<OverwriteDepotCostFormDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [OverwriteDepotCostFormDialogComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OverwriteDepotCostFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
