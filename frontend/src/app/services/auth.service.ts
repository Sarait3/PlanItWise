import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';

export interface AuthResponse {
  token: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  signup(data: { name: string; email: string; password: string }): Observable<string> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/users`, data).pipe(
      map((res: AuthResponse) => res.token)
    );
  }

  login(data: { email: string; password: string }): Observable<string> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth`, data).pipe(
      map((res: AuthResponse) => res.token)
    );
  }

  saveToken(token: string): void {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  logout(): void {
    localStorage.removeItem('token');
  }
}
