import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamNewComponent } from './team-new.component';

describe('GroupNewComponent', () => {
  let component: TeamNewComponent;
  let fixture: ComponentFixture<TeamNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeamNewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TeamNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
