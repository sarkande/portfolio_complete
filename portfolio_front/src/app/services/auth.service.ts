import { Injectable } from '@angular/core';
import { UserService } from './user.service';
import { UserAuthResponse } from '../interfaces/user-auth-response';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { UserAuthLogin } from '../interfaces/user-auth-login';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private userService: UserService) { }

  login(loginData: UserAuthLogin): Observable<boolean> {
    return this.userService.login(loginData).pipe(
      map((user: UserAuthResponse) => {
        if (user && user.token) {
          sessionStorage.setItem('jwt_token', user.token);
          return true;
        }
        return false;
      })
    );
  }

  getToken(): string | null {
    return sessionStorage.getItem('jwt_token');
  }

  logout(): void {
    sessionStorage.removeItem('jwt_token');
  }

  me(): Observable<UserAuthResponse> {
    return this.userService.me().pipe(
      catchError((error) => {
        if (error.status === 401) {
          this.logout();
          return throwError(() => new Error('User not authenticated'));
        }
        return throwError(() => error);
      })
    );
  }

  /**
   * Renvoie un Observable qui émet `true` si le token existe et que
   * l'appel à /me réussit, sinon `false`.
   */
  isAuthenticated(): Observable<boolean> {
    const token = this.getToken();
    if (!token) {
      return of(false);
    }
    return this.me().pipe(
      map(() => true),
      catchError(() => {
        // si /me renvoie une erreur, on purge le token et on renvoie false
        this.logout();
        return of(false);
      })
    );
  }
}