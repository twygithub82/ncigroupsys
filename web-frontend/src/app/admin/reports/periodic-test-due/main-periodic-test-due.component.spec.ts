import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainPeriodicTestDueComponent } from './main-periodic-test-due.component';

describe('MainPeriodicTestDueComponent', () => {
  let component: MainPeriodicTestDueComponent;
  let fixture: ComponentFixture<MainPeriodicTestDueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainPeriodicTestDueComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MainPeriodicTestDueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
