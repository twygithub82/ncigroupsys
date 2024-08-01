import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchedulingNewComponent } from './scheduling-new.component';

describe('CleaningProceduresComponent', () => {
  let component: SchedulingNewComponent;
  let fixture: ComponentFixture<SchedulingNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SchedulingNewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SchedulingNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
