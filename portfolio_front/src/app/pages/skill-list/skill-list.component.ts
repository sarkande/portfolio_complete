import { Component, OnInit } from '@angular/core';
import { SkillService } from '../../services/skill.service';
import { SkillCardComponent } from '../../components/skill-card/skill-card.component';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../services/language.service';
import { Subject, takeUntil } from 'rxjs';
import { SkillWithProjects } from '../../interfaces/skill-with-projects';
import { SkillHomeCardComponent } from '../../components/skill-home-card/skill-home-card.component';

@Component({
  selector: 'app-skill-list',
  imports: [SkillCardComponent, CommonModule, SkillHomeCardComponent],
  templateUrl: './skill-list.component.html',
  styleUrl: './skill-list.component.scss'
})
export class SkillListComponent implements OnInit {
  rawSkills: SkillWithProjects[] = []; // ← tous les skills bruts, non traduits
  skills: SkillWithProjects[] = [];
  private destroy$ = new Subject<void>();        // ← pour nettoyer l’abonnement
  constructor(private skillService: SkillService, private langService: LanguageService) { }

  ngOnInit(): void {
    this.skillService.getSkills()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (skills) => {
          console.log('Skills loaded:', skills);
          this.rawSkills = skills;
          this.setupLangListener();
        },
        error: (err) => {
          console.error('Error loading skills:', err);
        }
      });
  }
  private setupLangListener() {
    this.langService.currentLang$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.translateAll();
      });
  }

  translateAll() {
    this.skills = this.rawSkills.map(skill => ({
      ...skill,
      name: skill.name,
      content: this.langService.translateContent(skill.content),
      projects: skill.projects?.map(project => ({
        ...project,
        title: this.langService.translateContent(project.title),
        slug: project.slug
      }))
    }));
  }
}
