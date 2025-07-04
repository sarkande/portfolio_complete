import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { LanguageService } from '../../services/language.service'; // Chemin selon ton arborescence
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

  links = [
    { name: 'home', path: '' },
    { name: 'skills', path: 'skills' },
    { name: 'projects', path: 'projects' },
    { name: 'about', path: 'about' },
  ];

  socials = [
    { name: 'GitHub', icon: 'github.svg', url: 'https://github.com/sarkande' },
    {
      name: 'GitLab',
      icon: 'gitlab.svg',
      url: 'https://gitlab.com/aperezgo74',
    },
    {
      name: 'LinkedIn',
      icon: 'LinkedIn.svg',
      url: 'https://www.linkedin.com/in/allan-perez-gonzalez/',
    },
  ];

  constructor(private langService: LanguageService, private router: Router) {
    this.langService.currentLang$.subscribe((lang) => {
      this.currentLang = lang;
    });
  }

  switchLang(lang: string) {
    const segments = this.router.url.split('/').slice(2);
    const targetPath = [lang, ...segments].join('/');
    if (this.router.url !== `/${targetPath}`) {
      this.router.navigate([lang, ...segments]);
    }
  }

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  closeMobileMenu() {
    this.mobileMenuOpen = false;
  }
}
