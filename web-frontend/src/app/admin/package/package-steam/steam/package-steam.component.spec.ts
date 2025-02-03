import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PackageSteamComponent } from './package-steam.component';

describe('PackageSteamComponent', () => {
  let component: PackageSteamComponent;
  let fixture: ComponentFixture<PackageSteamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PackageSteamComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PackageSteamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
