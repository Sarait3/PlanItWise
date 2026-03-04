import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Contribution } from '../models/contribution.model';

@Injectable({
  providedIn: 'root'
})
export class ContributionService {

  private baseUrl = `${environment.apiUrl}/contributions`;

  constructor(private http: HttpClient) {}

  // Create a new contribution
  createContribution(data: Partial<Contribution>): Observable<Contribution> {
    return this.http.post<Contribution>(this.baseUrl, data);
  }

  // Get all contributions for a goal
  getContributionsByGoal(goalId: string): Observable<Contribution[]> {
    return this.http.get<Contribution[]>(`${this.baseUrl}/goal/${goalId}`);
  }

  // Delete a contribution
  deleteContribution(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
