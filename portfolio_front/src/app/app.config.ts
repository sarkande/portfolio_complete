import { ApplicationConfig, importProvidersFrom, SecurityContext } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';

import { routes } from './app.routes';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { provideAnimations } from '@angular/platform-browser/animations';

import { MarkdownModule, MarkedOptions, MARKED_OPTIONS, MarkedRenderer } from 'ngx-markdown';
import { Parser } from 'marked';
import { RecaptchaV3Module, RECAPTCHA_V3_SITE_KEY } from 'ng-recaptcha';


import { JwtInterceptor } from './services/jwt.interceptor';

// Modification du module de markdown pour gérer les slugs uniques dans les titres
// Dans le but de creer des ancres uniques pour chaque titre dans le contenu markdown
export function markedOptionsFactory(): MarkedOptions {
  const renderer = new MarkedRenderer();

  const slugify = (text: string): string =>
    text
      .toLowerCase()
      .trim()
      .replace(/[^\w]+/g, '-');

  renderer.heading = ({ tokens, depth }) => {
    const text = Parser.parseInline(tokens);
    const slug = slugify(text);
    return (
      `<h${depth} id="${slug}" name="${slug}" class="anchor">` +
      `${text}</h${depth}>`
    );

  };
  return { renderer } as MarkedOptions;
}


export function createTranslateLoader(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes,
      withInMemoryScrolling({
        anchorScrolling: 'enabled',
        scrollPositionRestoration: 'enabled',
      })
    ),
    provideHttpClient(withInterceptorsFromDi()),
    provideAnimations(),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true,
    },
    importProvidersFrom(
      MarkdownModule.forRoot({
        sanitize: SecurityContext.NONE,
        markedOptions: {
          provide: MARKED_OPTIONS,
          useFactory: markedOptionsFactory,
        },
      }),
      HttpClientModule,
      TranslateModule.forRoot({
        defaultLanguage: 'fr',
        loader: {
          provide: TranslateLoader,
          useFactory: createTranslateLoader,
          deps: [HttpClient],
        },
      })
    ),

  ],
};
