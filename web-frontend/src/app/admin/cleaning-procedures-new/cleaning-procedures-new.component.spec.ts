import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CleaningProceduresNewComponent } from './cleaning-procedures-new.component';

describe('CleaningProceduresComponent', () => {
  let component: CleaningProceduresNewComponent;
  let fixture: ComponentFixture<CleaningProceduresNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CleaningProceduresNewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CleaningProceduresNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
