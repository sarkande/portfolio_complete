import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { LanguageService } from '../../services/language.service';
import { TranslateModule } from '@ngx-translate/core';
import { SkillModel } from '../../interfaces/skill-model';
import { SkillService } from '../../services/skill.service';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterModule, TranslateModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
  standalone: true,
})
export class NavbarComponent implements OnInit {
  currentLang = 'fr';
  mobileMenuOpen = false;
  mobileSubmenu: string | null = null;

  links = [
    { name: 'home', path: '' },
    { name: 'profile', path: 'profile' },
    { name: 'skills', path: 'skills', hasSubmenu: true },
    { name: 'projects', path: 'projects' },
    { name: 'about', path: 'about' },
  ];

  socials = [
    { name: 'GitHub', icon: 'github.svg', url: 'https://github.com/sarkande' },
    { name: 'GitLab', icon: 'gitlab.svg', url: 'https://gitlab.com/aperezgo74' },
    { name: 'LinkedIn', icon: 'LinkedIn.svg', url: 'https://www.linkedin.com/in/allan-perez-gonzalez/' },
  ];

  skills: SkillModel[] = [];
  technicalSkills: SkillModel[] = [];
  humanSkills: SkillModel[] = [];

  constructor(
    private langService: LanguageService,
    private router: Router,
    private skillService: SkillService
  ) {
    this.langService.currentLang$.subscribe((lang) => {
      this.currentLang = lang;
    });
  }

  ngOnInit(): void {
    this.skillService.getSkills().subscribe((skills) => {
      this.skills = skills;
      this.technicalSkills = skills.filter((s) => s.isTechnical);
      this.humanSkills = skills.filter((s) => !s.isTechnical);
    });
  }

  @HostListener('window:resize')
  onResize() {
    // En repassant desktop, on nettoie l'état mobile
    if (window.innerWidth > 768) {
      this.mobileSubmenu = null;
    }
  }

  private isMobile(): boolean {
    return window.innerWidth <= 768;
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

  // Clic sur "Compétences"
  handleSkillsClick(event: MouseEvent) {
    if (this.isMobile()) {
      // Mobile : ouvrir la vue sous-menu et empêcher la navigation
      event.preventDefault();
      this.mobileSubmenu = 'skills';
    } else {
      // Desktop : laisser la navigation vers /skills si l'utilisateur clique.
      // Le hover gère le dropdown (pas de toggle ici).
    }
  }
}