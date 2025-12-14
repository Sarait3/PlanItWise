import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MilestonesService {

  private baseUrl = `${environment.apiUrl}/milestones`;

  constructor(private http: HttpClient) {}

  getMilestonesByGoal(goalId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/goal/${goalId}`);
  }

  createMilestone(data: any): Observable<any> {
    return this.http.post(this.baseUrl, data);
  }

  updateMilestone(id: string, updates: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, updates);
  }

  achieveMilestone(id: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/achieve/${id}`, {});
  }

  deleteMilestone(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
