import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { ArticleModel } from '../interfaces/article.model';

@Injectable({
  providedIn: 'root',
})
export class ArticleService {
  private base = '/articles';

  constructor(private apiService: ApiService) { }

  getArticles(): Observable<ArticleModel[]> {
    return this.apiService.get(`${this.base}`);
  }

  getArticle(slug: string): Observable<ArticleModel> {
    return this.apiService.get(`${this.base}/${slug}`);
  }

  createArticle(articleData: ArticleModel): Observable<any> {
    return this.apiService.post(`${this.base}`, articleData);
  }

  updateArticle(slug: string, articleData: ArticleModel): Observable<any> {
    return this.apiService.put(`${this.base}/${slug}`, articleData);
  }

  deleteArticle(slug: string): Observable<any> {
    return this.apiService.delete(`${this.base}/${slug}`);
  }
}
