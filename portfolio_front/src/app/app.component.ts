import { Component, OnInit } from '@angular/core';
import {
  RouterOutlet,
  Router,
  NavigationEnd,
  ActivatedRoute,
} from '@angular/router';
import { filter } from 'rxjs';
import { NavbarComponent } from './components/navbar/navbar.component';
import { LanguageService } from './services/language.service';

@Component({
    selector: 'app-root',
    imports: [RouterOutlet, NavbarComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    standalone: true,
})
export class AppComponent implements OnInit {
  title = 'portfolio';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private langService: LanguageService
  ) {}

  ngOnInit(): void {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        const lang = this.route.firstChild?.snapshot.paramMap.get('lang');
        if (lang) {
          this.langService.setLang(lang);
        }
      });
  }
}
