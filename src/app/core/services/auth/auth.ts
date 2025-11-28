import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { LoginRequest } from '../../models/login-request';
import { LoginResponse } from '../../models/login-response';
import { Menu } from '../menu/menu';


@Injectable({
  providedIn: 'root',
})
export class Auth {

  private apiUrl = environment.apiUrl + '/auth';
  
  constructor(private http: HttpClient,private menuService :Menu ) {}

  login(payload: LoginRequest) {
    debugger;
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, payload);
  }

  saveSession(token: string, user: any) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    if(user.menus){
      this.menuService.setMenu(user.menus)
    }
  }

  get token(): string | null {
    return localStorage.getItem('token');
  }

  get user() {
    const u = localStorage.getItem('user');
    return u ? JSON.parse(u) : null;
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
}
