import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { User, UpdateFinancesRequest } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class UserService {

  private apiUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  // GET /users/me
  getUser(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/me`);
  }

  // PUT /users/finances
  updateFinances(data: UpdateFinancesRequest): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/finances`, data);
  }
}