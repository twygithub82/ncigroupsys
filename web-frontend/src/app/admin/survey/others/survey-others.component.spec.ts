import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SurveyOthersComponent } from './survey-others.component';

describe('SurveyOthersComponent', () => {
  let component: SurveyOthersComponent;
  let fixture: ComponentFixture<SurveyOthersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SurveyOthersComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SurveyOthersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
