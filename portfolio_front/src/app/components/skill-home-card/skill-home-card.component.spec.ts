import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillHomeCardComponent } from './skill-home-card.component';

describe('SkillHomeCardComponent', () => {
  let component: SkillHomeCardComponent;
  let fixture: ComponentFixture<SkillHomeCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkillHomeCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SkillHomeCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
