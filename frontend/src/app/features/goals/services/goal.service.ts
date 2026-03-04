import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Goal } from '../models/goal.model';

@Injectable({ providedIn: 'root' })
export class GoalService {

  private apiUrl = `${environment.apiUrl}/goals`;

  constructor(private http: HttpClient) {}

  // Get the user's goal
  getGoal(): Observable<Goal> {
    return this.http.get<Goal>(`${this.apiUrl}/my-goal`);
  }

  // Create a new goal
  createGoal(data: Partial<Goal>): Observable<Goal> {
    return this.http.post<Goal>(this.apiUrl, data);
  }

  // Update an existing goal
  updateGoal(id: string, data: Partial<Goal>): Observable<Goal> {
    return this.http.put<Goal>(`${this.apiUrl}/${id}`, data);
  }

  // Delete a goal
  deleteGoal(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

    // Get savings plan for a goal 
  getSavingPlan(goalId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/savingPlan/${goalId}`);
  }
}