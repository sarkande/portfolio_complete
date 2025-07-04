import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core'; // si tu utilises ngx-translate

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  private langSubject = new BehaviorSubject<string>('fr');
  currentLang$ = this.langSubject.asObservable();

  constructor(private translate: TranslateService) {
    const defaultLang = 'fr';
    this.translate.setDefaultLang(defaultLang);
    this.langSubject.next(defaultLang);
  }

  translateContent(content: string): string {
    //get current language
    const currentLang = this.langSubject.value;
    // content can be a string or a json so we need to try to parse it
    try {
      const parsedContent = JSON.parse(content);
      if (parsedContent[currentLang]) {
        return parsedContent[currentLang];
      } else {
        return parsedContent['fr'] || parsedContent['en'] || content; // fallback to 'fr' or 'en'
      }
    } catch (e) {
      // If parsing fails, return the original content
      return content;
    }

  }
  setLang(lang: string) {
    this.langSubject.next(lang);
    this.translate.use(lang);
  }

  get currentLang() {
    return this.langSubject.value;
  }
}
