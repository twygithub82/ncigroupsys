import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelComponent } from './cancel.component';

describe('DeleteComponent', () => {
  let component: CancelComponent;
  let fixture: ComponentFixture<CancelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [CancelComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CancelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
