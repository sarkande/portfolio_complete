import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProjectModel } from '../../interfaces/project.model';
import { ProjectCardComponent } from '../../components/project-card/project-card.component';
import { CommonModule } from '@angular/common';
import { SearchSidebarComponent } from '../../components/search-sidebar/search-sidebar.component';
import { ProjectService } from '../../services/project.service';
import { Router, ActivatedRoute } from '@angular/router';
import { LanguageService } from '../../services/language.service';
import { Subject, takeUntil } from 'rxjs';
import { SkillModel } from '../../interfaces/skill-model';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [ProjectCardComponent, CommonModule, SearchSidebarComponent],
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss'],
})
export class ProjectListComponent implements OnInit, OnDestroy {
  rawProjects: ProjectModel[] = [];              // ← tous les projets bruts, non traduits
  projects: ProjectModel[] = [];                 // ← version traduite
  filtered: ProjectModel[] = [];

  minYear = 2000;
  maxYear = new Date().getFullYear();

  isSearchbarCollapsed = false; 

  private currentSearch = '';
  private currentTags: string[] = [];
  private currentGitPublic = false;
  private currentObsolete = false;
  private currentStartYear = this.minYear;
  private currentEndYear = this.maxYear;

  private destroy$ = new Subject<void>();        // ← pour nettoyer l’abonnement

  constructor(
    private projectService: ProjectService,
    private router: Router,
    private route: ActivatedRoute,
    private langService: LanguageService
  ) { }

  ngOnInit() {
    // 1️⃣ Chargement initial
    this.projectService.getProjects()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (projects) => {
          this.rawProjects = projects;
          //sort project by date, newest first, and if a project has no end date, it is considered as ongoing. if a project.old is true, it is considered as obsolete, so it is sorted last
          this.rawProjects.sort((a, b) => {
            const aEnd = a.endDate ? new Date(a.endDate) : new Date();
            const bEnd = b.endDate ? new Date(b.endDate) : new Date();

            return bEnd.getTime() - aEnd.getTime(); // newest first
          });

          this.initYears(projects);
          this.translateAll();           // première traduction
          this.setupLangListener();      // écoute les changements de langue
        },
        error: (err) => console.error(err),
      });
  }

  /** Initialise minYear / maxYear */
  private initYears(projects: ProjectModel[]) {
    const years = projects.flatMap(p => {
      const start = +p.startDate.slice(0, 4);
      const end = p.endDate ? +p.endDate.slice(0, 4) : start;
      return [start, end];
    });
    this.minYear = Math.min(...years);
    this.maxYear = Math.max(...years);
    this.currentStartYear = this.minYear;
    this.currentEndYear = this.maxYear;
  }

  /** Traduit tous les rawProjects et met à jour filtered */
  private translateAll() {
    this.projects = this.rawProjects.map(p => this.translateProject(p));
    this.applyFilters();
  }

  /** Réabonnement au changement de langue */
  private setupLangListener() {
    this.langService.currentLang$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.translateAll();
      });
  }

  onFiltersChanged(filters: {
    searchText: string;
    tags: string[];
    showGitPublic: boolean;
    showObsolete: boolean;
    startYear: number;
    endYear: number;
  }) {
    this.currentSearch = filters.searchText.toLowerCase();
    this.currentTags = filters.tags;
    this.currentGitPublic = filters.showGitPublic;
    this.currentObsolete = filters.showObsolete;
    this.currentStartYear = filters.startYear;
    this.currentEndYear = filters.endYear;
    this.applyFilters();
  }
  onSidebarToggled(collapsed: boolean) {
    console.log('Sidebar toggled:', collapsed);
    this.isSearchbarCollapsed = collapsed;
  }

  private applyFilters() {
    this.filtered = this.projects.filter(project => {
      const titleDesc = (project.title + project.description).toLowerCase();
      const matchSearch = !this.currentSearch || titleDesc.includes(this.currentSearch);
      const matchTags = this.currentTags.length === 0
        || this.currentTags.some(tag => project.technologies.includes(tag));
      const matchGit = !this.currentGitPublic || !!project.gitUrl;
      const matchObs = !this.currentObsolete || project.old;
      const startY = +project.startDate.slice(0, 4);
      const endY = project.endDate ? +project.endDate.slice(0, 4) : startY;
      const matchYear = startY <= this.currentEndYear && endY >= this.currentStartYear;
      return matchSearch && matchTags && matchGit && matchObs && matchYear;
    });
  }

  get allSkills(): SkillModel[] {
    const map = new Map<string, SkillModel>();

    this.rawProjects.forEach(project => {
      project.skills?.forEach(skill => {
        map.set(skill.name, skill);
      });
    });

    return Array
      .from(map.values())
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  handleClickProject(slug: string) {
    this.router.navigate([slug], { relativeTo: this.route });
  }

  private translateProject(p: ProjectModel): ProjectModel {
    return {
      ...p,
      title: this.langService.translateContent(p.title),
      description: this.langService.translateContent(p.description),
      content: this.langService.translateContent(p.content),
    };
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}