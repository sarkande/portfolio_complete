import {
  ApplicationConfig,
  importProvidersFrom,
  SecurityContext
} from '@angular/core';
import { provideRouter, TitleStrategy, withInMemoryScrolling } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';

import { HttpClientModule, HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import {
  MarkdownModule,
  MarkedOptions,
  MARKED_OPTIONS,
  MarkedRenderer
} from 'ngx-markdown';
import { Parser } from 'marked';

import { routes } from './app.routes';
import { JwtInterceptor } from './services/jwt.interceptor';
import { PageTitleService } from './services/page-title.service';

/** Loader pour ngx-translate */
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}

/** Options pour ngx-markdown (ancres uniques) */
export function markedOptionsFactory(): MarkedOptions {
  const renderer = new MarkedRenderer();
  const slugify = (text: string) =>
    text
      .toLowerCase()
      .trim()
      .replace(/[^\w]+/g, '-');

  renderer.heading = ({ tokens, depth }) => {
    const txt = Parser.parseInline(tokens);
    const slug = slugify(txt);
    return `<h${depth} id="${slug}" name="${slug}">${txt}</h${depth}>`;
  };

  return { renderer } as MarkedOptions;
}

export const appConfig: ApplicationConfig = {
  providers: [
    // 1) On importe d’abord les modules qui fournissent TranslateService
    importProvidersFrom(
      HttpClientModule,
      TranslateModule.forRoot({
        defaultLanguage: 'fr',
        loader: {
          provide: TranslateLoader,
          useFactory: createTranslateLoader,
          deps: [HttpClient]
        }
      }),
      MarkdownModule.forRoot({
        sanitize: SecurityContext.NONE,
        markedOptions: {
          provide: MARKED_OPTIONS,
          useFactory: markedOptionsFactory
        }
      })
    ),

    // 2) Puis le router
    provideRouter(
      routes,
      withInMemoryScrolling({
        anchorScrolling: 'enabled',
        scrollPositionRestoration: 'enabled'
      })
    ),

    // 3) Ensuite, on peut enregistrer la TitleStrategy,
    //    sachant que TranslateService est maintenant dispo
    { provide: TitleStrategy, useClass: PageTitleService },

    // 4) Le reste de tes providers
    provideHttpClient(withInterceptorsFromDi()),
    provideAnimations(),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    }
  ]
};