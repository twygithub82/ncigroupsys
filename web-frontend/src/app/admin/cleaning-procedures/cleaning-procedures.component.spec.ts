import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CleaningProceduresComponent } from './cleaning-procedures.component';

describe('CleaningProceduresComponent', () => {
  let component: CleaningProceduresComponent;
  let fixture: ComponentFixture<CleaningProceduresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CleaningProceduresComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CleaningProceduresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
