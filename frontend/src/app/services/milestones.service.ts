import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MilestonesService {

  private baseUrl = '${environment.apiUrl}/milestones';

  constructor(private http: HttpClient) {}

  // Get all milestones for a goal
  getMilestonesByGoal(goalId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/goal/${goalId}`);
  }

  // Create milestone (auto or custom)
  createMilestone(data: any): Observable<any> {
    return this.http.post(this.baseUrl, data);
  }

  // Update milestone (needed for marking achieved = true)
  updateMilestone(id: string, updates: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, updates);
  }

  // Mark a milestone as manually achieved — optional
  achieveMilestone(id: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/achieve/${id}`, {});
  }

  // Delete milestone
  deleteMilestone(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
