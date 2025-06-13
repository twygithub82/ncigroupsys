import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReownerTankFormDialogComponent } from './reowner-tank-form-dialog.component';

describe('ReownerTankFormDialogComponent', () => {
  let component: ReownerTankFormDialogComponent;
  let fixture: ComponentFixture<ReownerTankFormDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [ReownerTankFormDialogComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReownerTankFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
