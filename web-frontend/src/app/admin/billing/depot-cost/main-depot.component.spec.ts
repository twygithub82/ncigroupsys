import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainDepotComponent } from './main-depot.component';

describe('MainDepotComponent', () => {
  let component: MainDepotComponent;
  let fixture: ComponentFixture<MainDepotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainDepotComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MainDepotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
