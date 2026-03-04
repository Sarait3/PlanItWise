import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Milestone } from '../models/milestone.model';

@Injectable({
  providedIn: 'root'
})
export class MilestonesService {

  private baseUrl = `${environment.apiUrl}/milestones`;

  constructor(private http: HttpClient) {}

  // Get milestones for a goal
  getMilestonesByGoal(goalId: string): Observable<Milestone[]> {
    return this.http.get<Milestone[]>(`${this.baseUrl}/goal/${goalId}`);
  }

  // Create a milestone
  createMilestone(data: Partial<Milestone>): Observable<Milestone> {
    return this.http.post<Milestone>(this.baseUrl, data);
  }

  // Mark milestone as achieved
  achieveMilestone(id: string): Observable<Milestone> {
    return this.http.put<Milestone>(`${this.baseUrl}/achieve/${id}`, {});
  }

  // Delete a milestone
  deleteMilestone(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}