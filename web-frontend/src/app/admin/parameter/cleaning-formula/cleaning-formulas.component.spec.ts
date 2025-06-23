import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CleaningFormulasComponent } from './cleaning-formulas.component';

describe('CleaningFormulasComponent', () => {
  let component: CleaningFormulasComponent;
  let fixture: ComponentFixture<CleaningFormulasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CleaningFormulasComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CleaningFormulasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
