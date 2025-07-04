import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  Router,
} from '@angular/router';

@Injectable({ providedIn: 'root' })
export class LangGuard implements CanActivate {
  constructor(private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const lang = route.params['lang'];
    if (lang === 'fr' || lang === 'en') {
      return true;
    }
    this.router.navigate(['/fr/404']);
    return false;
  }
}