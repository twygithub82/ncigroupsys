import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainPackageSteamComponent } from './main-package-steam.component';

describe('MainPackageSteamComponent', () => {
  let component: MainPackageSteamComponent;
  let fixture: ComponentFixture<MainPackageSteamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainPackageSteamComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MainPackageSteamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
