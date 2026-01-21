import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MappingChartFormDialogComponent } from './mapping-chart-form-dialog.component';

describe('MappingChartFormDialogComponent', () => {
  let component: MappingChartFormDialogComponent;
  let fixture: ComponentFixture<MappingChartFormDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [MappingChartFormDialogComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MappingChartFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
