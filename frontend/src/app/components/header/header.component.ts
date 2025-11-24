import { Component } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './header.component.html'
})
export class HeaderComponent {

  constructor(
    private router: Router,
    private auth: AuthService
  ) {}

  get isAuthPage(): boolean {
    const url = this.router.url;
    return url.includes('login') || url.includes('signup');
  }

  get isLoggedIn(): boolean {
    return this.auth.isLoggedIn();
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/']);
  }
}
