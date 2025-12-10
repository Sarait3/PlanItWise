import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class GoalService {
    private apiUrl = 'http://localhost:4000/api/goals';

    constructor(private http: HttpClient) {}

    getGoal(): Observable<any> {
        return this.http.get(`${this.apiUrl}/my-goal`);
    }

    createGoal(data: any): Observable<any> {
        return this.http.post(`${this.apiUrl}`, data);
    }

    updateGoal(id: string, data: any): Observable<any> {
        return this.http.put(`${this.apiUrl}/${id}`, data);
    }

    deleteGoal(id: string) {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }
}
