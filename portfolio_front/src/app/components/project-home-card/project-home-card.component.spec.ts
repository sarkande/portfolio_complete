import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectHomeCardComponent } from './project-home-card.component';

describe('ProjectHomeCardComponent', () => {
  let component: ProjectHomeCardComponent;
  let fixture: ComponentFixture<ProjectHomeCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectHomeCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectHomeCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
