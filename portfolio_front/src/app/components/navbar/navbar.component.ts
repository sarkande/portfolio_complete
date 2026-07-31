import { Component, OnInit, HostListener, OnDestroy, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { LanguageService } from '../../services/language.service';
import { TranslateModule } from '@ngx-translate/core';
import { SkillModel } from '../../interfaces/skill-model';
import { SkillService } from '../../services/skill.service';
import { ProjectService } from '../../services/project.service';
import { ProjectModel } from '../../interfaces/project.model';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterModule, TranslateModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
  standalone: true,
})
export class NavbarComponent implements OnInit, OnDestroy {
  currentLang = 'fr';
  mobileMenuOpen = false;
  mobileSubmenu: string | null = null;

  availableLangs = [
    { code: 'fr', flag: 'fr', label: 'Français' },
    { code: 'en', flag: 'gb', label: 'English' },
  ];
  langMenuOpen = false;

  get currentLangOption() {
    return this.availableLangs.find((l) => l.code === this.currentLang) ?? this.availableLangs[0];
  }

  links = [
    { name: 'navbar.home', path: '' },
    { name: 'navbar.profile', path: 'profile' },
    { name: 'navbar.skills', path: 'skills', hasSubmenu: true },
    { name: 'navbar.projects', path: 'projects', hasSubmenu: true },
    { name: 'navbar.blog', path: 'blog' },
    { name: 'navbar.about', path: 'about' },
  ];

  socials = [
    { name: 'GitHub', icon: 'github.svg', url: 'https://github.com/sarkande' },
    { name: 'GitLab', icon: 'gitlab.svg', url: 'https://gitlab.com/aperezgo74' },
    { name: 'LinkedIn', icon: 'LinkedIn.svg', url: 'https://www.linkedin.com/in/allan-perez-gonzalez/' },
  ];

  skills: SkillModel[] = [];
  technicalSkills: SkillModel[] = [];
  humanSkills: SkillModel[] = [];

  rawProjects: ProjectModel[] = []; // Projets bruts non traduits
  projects: ProjectModel[] = [];     // Projets traduits

  private destroy$ = new Subject<void>();

  constructor(
    private langService: LanguageService,
    private router: Router,
    private skillService: SkillService,
    private projectService: ProjectService,
    private elementRef: ElementRef<HTMLElement>
  ) {
    this.langService.currentLang$.subscribe((lang) => {
      this.currentLang = lang;
    });
  }

  ngOnInit(): void {
    // Chargement des compétences
    this.skillService.getSkills().subscribe((skills) => {
      this.skills = skills;
      this.technicalSkills = skills.filter((s) => s.isTechnical);
      this.humanSkills = skills.filter((s) => !s.isTechnical);
    });

    // Chargement des projets avec traduction
    this.projectService.getProjects()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (projects) => {
          this.rawProjects = projects;
          this.translateProjects();
          this.setupLangListener();
        },
        error: (err) => console.error('Error loading projects:', err),
      });
  }

  /** Traduit tous les projets */
  private translateProjects() {
    this.projects = this.rawProjects.map(p => this.translateProject(p));
  }

  /** Traduit un projet individuel */
  private translateProject(p: ProjectModel): ProjectModel {
    return {
      ...p,
      title: this.langService.translateContent(p.title),
      description: this.langService.translateContent(p.description),
      content: this.langService.translateContent(p.content),
    };
  }

  /** Écoute les changements de langue pour retraduire */
  private setupLangListener() {
    this.langService.currentLang$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.translateProjects();
      });
  }

  @HostListener('window:resize')
  onResize() {
    if (window.innerWidth > 1300) {
      this.mobileSubmenu = null;
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (this.langMenuOpen && !this.elementRef.nativeElement.contains(event.target as Node)) {
      this.langMenuOpen = false;
    }
  }

  toggleLangMenu(event: MouseEvent) {
    event.stopPropagation();
    this.langMenuOpen = !this.langMenuOpen;
  }

  closeLangMenu() {
    this.langMenuOpen = false;
  }

  private isMobile(): boolean {
    return window.innerWidth <= 1300;
  }

  switchLang(lang: string) {
    const segments = this.router.url.split('/').slice(2);
    const targetPath = [lang, ...segments].join('/');

    this.updateMetadata(lang);

    if (this.router.url !== `/${targetPath}`) {
      this.router.navigate([lang, ...segments]);
    }
  }

  private updateMetadata(lang: string) {
    const descriptionMeta = document.querySelector('meta[name="description"]');
    if (descriptionMeta) {
      const content =
        lang === 'fr'
          ? `Portfolio d'Allan Perez, expert en ingénierie logicielle : découvrez mes projets et solutions full-stack en Odoo, Angular, Java, React et C#.`
          : `Allan Perez's portfolio, showcasing software engineering expertise: discover my full-stack projects and solutions in Odoo, Angular, Java, React and C#.`;
      descriptionMeta.setAttribute('content', content);
    }

    const keywordsMeta = document.querySelector('meta[name="keywords"]');
    if (keywordsMeta) {
      const content =
        lang === 'fr'
          ? 'Allan Perez, portfolio, ingénieur logiciel, Odoo, Angular, Java, React, C#, projets, solutions full-stack'
          : 'Allan Perez, portfolio, software engineer, Odoo, Angular, Java, React, C#, projects, full-stack solutions';
      keywordsMeta.setAttribute('content', content);
    }

    document.documentElement.lang = lang;
  }

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
    if (!this.mobileMenuOpen) this.mobileSubmenu = null;
  }

  closeMobileMenu() {
    this.mobileMenuOpen = false;
    this.mobileSubmenu = null;
  }

  // Gestion du clic sur les liens avec sous-menu
  handleSubmenuClick(event: MouseEvent, submenuType: string) {
    if (this.isMobile()) {
      event.preventDefault();
      this.mobileSubmenu = submenuType;
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}