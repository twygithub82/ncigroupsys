import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateTankNoDialogComponent } from './update-tank-no-dialog.component';

describe('UpdateTankNoDialogComponent', () => {
  let component: UpdateTankNoDialogComponent;
  let fixture: ComponentFixture<UpdateTankNoDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [UpdateTankNoDialogComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateTankNoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
