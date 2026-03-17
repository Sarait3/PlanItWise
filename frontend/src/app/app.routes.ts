import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/pages/login/login.component';
import { HomeComponent } from './features/home/pages/home/home.component';
import { SignupComponent } from './features/auth/pages/signup-step1/signup-step1.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },

  { path: 'finances',
     loadComponent: () =>
      import('./features/auth/pages/signup-step2/signup-step2.component')
            .then(m=>m.Signup2Component) 
          },

  { path: 'dashboard',
     loadComponent: () =>
      import('./features/dashboard/pages/dashboard/dashboard.component')
            .then(m=>m.DashboardComponent) 
          },

  { path: 'goal/step1', 
    loadComponent: () =>
      import('./features/goal-wizard/pages/step1/step1.component')
        .then(m=>m.Step1Component)
      },

  { path: 'goal/step2', 
    loadComponent: () =>
      import('./features/goal-wizard/pages/step2/step2.component')
          .then(m=>m.Step2Component) },

  { path: 'goal/step3', 
    loadComponent: () =>
      import('./features/goal-wizard/pages/step3/step3.component')
          .then(m=>m.Step3Component) },

    { path: 'goal/step4', 
    loadComponent: () =>
      import('./features/goal-wizard/pages/step4/step4.component')
          .then(m=>m.Step4Component) },

  { path: 'goal', redirectTo: 'goal/step1', pathMatch: 'full' },

  { path: '**', redirectTo: '' }, 
];
