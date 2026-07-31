import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MarkdownModule } from 'ngx-markdown';
import { finalize, switchMap, tap, takeUntil, of, Subject } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { ArticleService } from '../../services/article.service';
import { ArticleModel } from '../../interfaces/article.model';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-blog-article',
  standalone: true,
  imports: [CommonModule, RouterModule, MarkdownModule, TranslateModule],
  templateUrl: './blog-article.component.html',
  styleUrls: ['./blog-article.component.scss'],
})
export class BlogArticleComponent implements OnInit, OnDestroy {
  article: ArticleModel | null = null;
  prevArticle?: ArticleModel;
  nextArticle?: ArticleModel;
  toc: Array<{ level: number; text: string; slug: string }> = [];
  isLoading = true;
  currentLang = 'fr';

  private destroy$ = new Subject<void>();

  constructor(
    private langService: LanguageService,
    private articleService: ArticleService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.langService.currentLang$
      .pipe(takeUntil(this.destroy$))
      .subscribe((lang) => (this.currentLang = lang));
  }

  ngOnInit() {
    this.route.paramMap
      .pipe(
        tap(() => {
          this.isLoading = true;
          this.article = null;
          this.toc = [];
        }),
        switchMap((params) => {
          const slug = params.get('slug');
          if (!slug) {
            this.router.navigate(['/', this.currentLang, '404']);
            return of(null);
          }
          return this.articleService.getArticles().pipe(
            finalize(() => (this.isLoading = false)),
            switchMap((articles) => of({ articles, slug }))
          );
        }),
        takeUntil(this.destroy$)
      )
      .subscribe((result) => {
        if (!result) return;
        const { articles, slug } = result;

        articles.sort(
          (a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime()
        );

        const idx = articles.findIndex((a) => a.slug === slug);
        if (idx === -1) {
          this.router.navigate(['/', this.currentLang, '404']);
          return;
        }

        this.article = this.translateArticle(articles[idx]);
        this.prevArticle = articles[idx - 1] ? this.translateArticle(articles[idx - 1]) : undefined;
        this.nextArticle = articles[idx + 1] ? this.translateArticle(articles[idx + 1]) : undefined;
        this.buildToc(this.article.content);
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

  private slugify(text: string): string {
    return text.toLowerCase().trim().replace(/[^\w]+/g, '-');
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
