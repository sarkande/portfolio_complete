import { Component, HostListener, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { LanguageService } from '../../services/language.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterModule, TranslateModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
  standalone: true,
})
export class NavbarComponent {
  currentLang = 'fr';
  mobileMenuOpen = false;

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
    { name: 'navbar.skills', path: 'skills' },
    { name: 'navbar.projects', path: 'projects' },
    { name: 'navbar.blog', path: 'blog' },
    { name: 'navbar.about', path: 'about' },
  ];

  socials = [
    { name: 'GitHub', icon: 'github.svg', url: 'https://github.com/sarkande' },
    { name: 'GitLab', icon: 'gitlab.svg', url: 'https://gitlab.com/aperezgo74' },
    { name: 'LinkedIn', icon: 'LinkedIn.svg', url: 'https://www.linkedin.com/in/allan-perez-gonzalez/' },
  ];

  constructor(
    private langService: LanguageService,
    private router: Router,
    private elementRef: ElementRef<HTMLElement>
  ) {
    this.langService.currentLang$.subscribe((lang) => {
      this.currentLang = lang;
    });
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
  }

  closeMobileMenu() {
    this.mobileMenuOpen = false;
  }
}
