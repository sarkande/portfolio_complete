import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ArticleModel } from '../../interfaces/article.model';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-blog-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './blog-card.component.html',
  styleUrl: './blog-card.component.scss',
})
export class BlogCardComponent {
  @Input() article!: ArticleModel;

  currentLang = 'fr';

  constructor(private langService: LanguageService) {
    this.langService.currentLang$.subscribe((lang) => {
      this.currentLang = lang;
    });
  }
}
