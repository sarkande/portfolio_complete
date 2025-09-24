import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MarkdownModule } from 'ngx-markdown';
import { Subject, finalize, of, switchMap, takeUntil, tap } from 'rxjs';
import { StarRatingComponent } from '../../components/star-rating/star-rating.component';
import { SkillWithProjects } from '../../interfaces/skill-with-projects';
import { LanguageService } from '../../services/language.service';
import { SkillService } from '../../services/skill.service';

@Component({
  selector: 'app-skill',
  standalone: true,
  imports: [CommonModule, RouterModule, MarkdownModule, StarRatingComponent],
  templateUrl: './skill.component.html',
  styleUrls: ['./skill.component.scss']
})
export class SkillComponent implements OnInit, OnDestroy {
  skill: SkillWithProjects | null = null;
  prevSkill?: SkillWithProjects;
  nextSkill?: SkillWithProjects;
  toc: Array<{ level: number; text: string; slug: string }> = [];
  isLoading = true;
  currentLang = 'fr';

  private destroy$ = new Subject<void>();
  private goldenAngle = 137.508;

  constructor(
    private langService: LanguageService,
    private skillService: SkillService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.langService.currentLang$
      .pipe(takeUntil(this.destroy$))
      .subscribe(lang => (this.currentLang = lang));
  }

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        tap(() => {
          this.isLoading = true;
          this.skill = null;
          this.prevSkill = undefined;
          this.nextSkill = undefined;
          this.toc = [];
        }),
        switchMap(params => {
          const rawName = params.get('name');
          if (!rawName) {
            this.router.navigate(['/', this.currentLang, '404']);
            return of(null);
          }
          const decodedName = decodeURIComponent(rawName);
          return this.skillService.getSkills().pipe(
            finalize(() => (this.isLoading = false)),
            switchMap(skills => of({ skills, name: decodedName }))
          );
        }),
        takeUntil(this.destroy$)
      )
      .subscribe(result => {
        if (!result) {
          return;
        }
        const { skills, name } = result;
        const normalizedName = name.trim().toLowerCase();

        const orderedSkills = [...skills].sort((a, b) =>
          a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })
        );

        const idx = orderedSkills.findIndex(
          skill => skill.name.trim().toLowerCase() === normalizedName
        );
        if (idx === -1) {
          this.router.navigate(['/', this.currentLang, '404']);
          return;
        }

        this.skill = this.translateSkill(orderedSkills[idx]);
        this.prevSkill = orderedSkills[idx - 1]
          ? this.translateSkill(orderedSkills[idx - 1])
          : undefined;
        this.nextSkill = orderedSkills[idx + 1]
          ? this.translateSkill(orderedSkills[idx + 1])
          : undefined;

        if (this.skill) {
          const markdown = this.skill.longDescription || this.skill.content || '';
          this.buildToc(markdown);
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  trackByProject(_: number, project: { slug: string }): string {
    return project.slug;
  }

  getTagBgColor(id: number = 1): string {
    const hue = (id * this.goldenAngle) % 360;
    return `hsl(${hue.toFixed(1)}, 50%, 85%)`;
  }

  getTagTextColor(id: number = 1): string {
    const hue = (id * this.goldenAngle) % 360;
    return `hsl(${hue.toFixed(1)}, 70%, 25%)`;
  }

  private translateSkill(skill: SkillWithProjects): SkillWithProjects {
    if (!skill) {
      return skill;
    }
    return {
      ...skill,
      content: skill.content ? this.langService.translateContent(skill.content) : '',
      description: skill.description
        ? this.langService.translateContent(skill.description)
        : '',
      longDescription: skill.longDescription
        ? this.langService.translateContent(skill.longDescription)
        : '',
      projects: skill.projects?.map(project => ({
        ...project,
        title: project.title ? this.langService.translateContent(project.title) : ''
      }))
    };
  }

  private buildToc(markdown: string): void {
    const regex = /^(#{2,6})\s+(.*)$/gm;
    let match: RegExpExecArray | null;
    while ((match = regex.exec(markdown))) {
      const level = match[1].length;
      const text = match[2].trim();
      const slug = this.slugify(text);
      this.toc.push({ level, text, slug });
    }
  }

  private slugify(text: string): string {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w]+/g, '-');
  }
}
