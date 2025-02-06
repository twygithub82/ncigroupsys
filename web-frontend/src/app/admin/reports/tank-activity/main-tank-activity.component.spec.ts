import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainTankActivityComponent } from './main-tank-activity.component';

describe('MainTankActivityComponent', () => {
  let component: MainTankActivityComponent;
  let fixture: ComponentFixture<MainTankActivityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainTankActivityComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MainTankActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
