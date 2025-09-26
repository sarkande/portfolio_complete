import { Component, OnInit } from '@angular/core';
import { SkillService } from '../../services/skill.service';
import { SkillCardComponent } from '../../components/skill-card/skill-card.component';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../services/language.service';
import { Subject, takeUntil } from 'rxjs';
import { SkillWithProjects } from '../../interfaces/skill-with-projects';
import { ActivatedRoute, Router } from '@angular/router';
import { SkillModel } from '../../interfaces/skill-model';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-skill-list',
  imports: [SkillCardComponent, CommonModule , TranslateModule],
  templateUrl: './skill-list.component.html',
  styleUrl: './skill-list.component.scss'
})
export class SkillListComponent implements OnInit {
  rawSkills: SkillWithProjects[] = []; // ← tous les skills bruts, non traduits
  skills: SkillWithProjects[] = [];
  private destroy$ = new Subject<void>();        // ← pour nettoyer l’abonnement
  constructor(private skillService: SkillService, private langService: LanguageService, private router: Router, private route:ActivatedRoute) { }

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

  handleClickSkill(name: string) {
    console.log('Navigating to skill:', name);
    this.router.navigate([name], { relativeTo: this.route });
  }
  translateAll() {
    this.skills = this.rawSkills.map(s => this.translateSkill(s));
  }

  private translateSkill(skill: SkillModel): SkillModel {
    return {
      ...skill,
      name: this.langService.translateContent(skill.name),
      description: this.langService.translateContent(skill.description),
      content: this.langService.translateContent(skill.content),
      longDescription: this.langService.translateContent(skill.longDescription)
      
    }
  }
}
