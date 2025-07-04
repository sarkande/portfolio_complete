import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { UserAuthLogin } from '../interfaces/user-auth-login';
import { Observable } from 'rxjs';
import { UserAuthResponse } from '../interfaces/user-auth-response';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private apiService: ApiService) { }


  login(user: UserAuthLogin): Observable<UserAuthResponse> {
    return this.apiService.post<UserAuthResponse>('/auth/login', user);
  }

  me(): Observable<UserAuthResponse> {
    return this.apiService.get<UserAuthResponse>('/me');
  }
}
