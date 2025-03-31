import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainPerformanceComponent } from './main-performance.component';

describe('MainPerformanceComponent', () => {
  let component: MainPerformanceComponent;
  let fixture: ComponentFixture<MainPerformanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainPerformanceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MainPerformanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
