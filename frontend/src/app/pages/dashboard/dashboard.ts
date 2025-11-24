import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="min-height:100vh; display:flex; align-items:center; justify-content:center; flex-direction:column; gap:12px;">
      <h2>Welcome to your PlanItWise dashboard</h2>
      <p>You are logged in.</p>
      <button (click)="logout()">Logout</button>
    </div>
  `,
})
export class Dashboard {
  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  logout() {
    this.auth.logout();
    this.router.navigate(['/']);
  }
}
