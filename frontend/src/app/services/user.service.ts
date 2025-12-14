import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserService {

  private apiUrl = '${environment.apiUrl}/users';

  constructor(private http: HttpClient) {}

  getUser(): Observable<any> {
    return this.http.get(`${this.apiUrl}/me`);
  }

  updateFinances(data: {
    monthlyIncome: number;
    monthlyExpenses: number;
  }): Observable<any> {
    return this.http.put(`${this.apiUrl}/finances`, data);
  }
}
