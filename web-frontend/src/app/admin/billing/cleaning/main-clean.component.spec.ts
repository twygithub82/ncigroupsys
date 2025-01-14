import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainCleaningComponent } from './main-clean.component';

describe('MainCleaningComponent', () => {
  let component: MainCleaningComponent;
  let fixture: ComponentFixture<MainCleaningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainCleaningComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MainCleaningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
