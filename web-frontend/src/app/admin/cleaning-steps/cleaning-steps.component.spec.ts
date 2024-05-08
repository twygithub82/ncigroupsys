import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CleaningStepsComponent } from './cleaning-steps.component';

describe('CleaningStepsComponent', () => {
  let component: CleaningStepsComponent;
  let fixture: ComponentFixture<CleaningStepsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CleaningStepsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CleaningStepsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
