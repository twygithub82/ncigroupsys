import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainPendingComponent } from './main-pending.component';

describe('MainPendingComponent', () => {
  let component: MainPendingComponent;
  let fixture: ComponentFixture<MainPendingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainPendingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MainPendingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
