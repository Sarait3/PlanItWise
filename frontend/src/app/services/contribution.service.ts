import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ContributionService {

  private baseUrl = `${environment.apiUrl}/contributions`;

  constructor(private http: HttpClient) {}

  createContribution(data: any): Observable<any> {
    return this.http.post(this.baseUrl, data);
  }

  getContributionsByGoal(goalId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/goal/${goalId}`);
  }

  deleteContribution(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
