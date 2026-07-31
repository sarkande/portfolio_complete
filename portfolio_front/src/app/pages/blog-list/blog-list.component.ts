import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { ArticleModel } from '../../interfaces/article.model';
import { ArticleService } from '../../services/article.service';
import { LanguageService } from '../../services/language.service';
import { BlogCardComponent } from '../../components/blog-card/blog-card.component';

@Component({
  selector: 'app-blog-list',
  standalone: true,
  imports: [CommonModule, BlogCardComponent, TranslateModule],
  templateUrl: './blog-list.component.html',
  styleUrls: ['./blog-list.component.scss'],
})
export class BlogListComponent implements OnInit, OnDestroy {
  rawArticles: ArticleModel[] = [];
  articles: ArticleModel[] = [];

  private destroy$ = new Subject<void>();

  constructor(
    private articleService: ArticleService,
    private langService: LanguageService
  ) {}

  ngOnInit() {
    this.articleService.getArticles()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (articles) => {
          this.rawArticles = articles.sort(
            (a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime()
          );
          this.translateAll();
          this.setupLangListener();
        },
        error: (err) => console.error('Error loading articles:', err),
      });
  }

  private translateAll() {
    this.articles = this.rawArticles.map((a) => this.translateArticle(a));
  }

  private setupLangListener() {
    this.langService.currentLang$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.translateAll());
  }

  private translateArticle(a: ArticleModel): ArticleModel {
    return {
      ...a,
      title: this.langService.translateContent(a.title),
      excerpt: this.langService.translateContent(a.excerpt),
      content: this.langService.translateContent(a.content),
    };
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
