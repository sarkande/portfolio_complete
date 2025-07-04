// project.component.ts
import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MarkdownModule } from 'ngx-markdown';
import { finalize, switchMap, tap, takeUntil, of, Subject } from 'rxjs';
import { ProjectService } from '../../services/project.service';
import { ProjectModel } from '../../interfaces/project.model';
import { CarouselComponent } from '../../components/carousel/carousel.component';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-project',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MarkdownModule,
    CarouselComponent
  ],
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent implements OnInit, OnDestroy  {
  project: ProjectModel | null = null;
  prevProject?: ProjectModel;
  nextProject?: ProjectModel;
  toc: Array<{ level: number; text: string; slug: string }> = [];
  isLoading = true;
  currentLang = 'fr';

  private projectService = inject(ProjectService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private langService = inject(LanguageService);
  private destroy$ = new Subject<void>();

  constructor() {
    this.langService.currentLang$
    .pipe(takeUntil(this.destroy$))
    .subscribe(lang => this.currentLang = lang);
  }
  
  ngOnInit() {
    this.route.paramMap
    .pipe(
        tap(() => {
          // reset avant chaque chargement
          this.isLoading = true;
          this.project = null;
          this.toc = [];
        }),
        switchMap(params => {
          const slug = params.get('slug');
          if (!slug) {
            this.router.navigate(['/', this.currentLang, '404']);
            return of(null);
          }
          return this.projectService.getProjects()
          .pipe(
              finalize(() => this.isLoading = false),
              switchMap(projects => of({ projects, slug }))
            );
        }),
        takeUntil(this.destroy$)
      )
      .subscribe(result => {
        if (!result) return;
        const { projects, slug } = result;
        const idx = projects.findIndex(p => p.slug === slug);
        if (idx === -1) {
          this.router.navigate(['/', this.currentLang, '404']);
          return;
        }
        // assignation
        this.project = this.translateProject(projects[idx]);
        this.prevProject = this.translateProject(projects[idx - 1]);
        this.nextProject = this.translateProject(projects[idx + 1]);
        this.buildToc(this.project.content);
      });
    }

    private buildToc(markdown: string) {
    const regex = /^(#{2,6})\s+(.*)$/gm;
    let match: RegExpExecArray | null;
    while ((match = regex.exec(markdown))) {
      const level = match[1].length;
      const text = match[2].trim();
      const slug = this.slugify(text);
      this.toc.push({ level, text, slug });
    }
  }
  
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  translateProject(project: ProjectModel): ProjectModel {
    console.log('Translating project:', project);
    if (!project) return project;
    console.log('Current language:', this.currentLang);
    return {
      ...project,
      title: this.langService.translateContent(project.title),
      description: this.langService.translateContent(project.description),
      content: this.langService.translateContent(project.content)
    };
  }
  
  //Meme algo que pour slugify les titres dans le markdown (app.config.ts)
  private slugify(text: string): string {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w]+/g, '-');
  }
  
  
  
}
