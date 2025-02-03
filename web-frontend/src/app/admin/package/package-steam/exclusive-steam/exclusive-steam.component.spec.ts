import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExclusiveSteamComponent } from './exclusive-steam.component';

describe('ExclusiveSteamComponent', () => {
  let component: ExclusiveSteamComponent;
  let fixture: ComponentFixture<ExclusiveSteamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExclusiveSteamComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ExclusiveSteamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
