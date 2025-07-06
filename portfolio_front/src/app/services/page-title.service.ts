import { take } from 'rxjs/operators';
import { ActivatedRouteSnapshot, RouterStateSnapshot, TitleStrategy } from '@angular/router';
import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';

@Injectable({ providedIn: 'root' })
export class PageTitleService extends TitleStrategy {
  constructor(
    private title: Title,
    private translate: TranslateService
  ) { super(); }

  override updateTitle(snapshot: RouterStateSnapshot): void {
    const titleKey = this.findDeepestTitle(snapshot.root) ?? 'title.default';
    // On attend que la traduction soit prête avant de setter le titre
    this.translate.get(titleKey)
      .pipe(take(1))
      .subscribe(translated => {
        this.title.setTitle(translated);
      });
  }

  private findDeepestTitle(route: ActivatedRouteSnapshot): string | undefined {
    let title = route.data['title'] as string | undefined;
    for (const child of route.children) {
      const childTitle = this.findDeepestTitle(child);
      if (childTitle) {
        title = childTitle;
      }
    }
    return title;
  }
}