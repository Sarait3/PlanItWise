import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { HomeComponent } from './pages/home/home';
import { Signup } from './pages/signup/signup';
import { Dashboard } from './pages/dashboard/dashboard';
import { Step1Component } from './pages/goal-wizard/step1/step1.component';
import { Step2Component } from './pages/goal-wizard/step2/step2.component';
import { Step3Component } from './pages/goal-wizard/step3/step3.component';
import { Step4Component } from './pages/goal-wizard/step4/step4.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: Login },
  { path: 'signup', component: Signup },
  { path: 'dashboard', component: Dashboard },
    { path: 'goal/step1', component: Step1Component },
  { path: 'goal/step2', component: Step2Component },
  { path: 'goal/step3', component: Step3Component },
  { path: 'goal/step4', component: Step4Component },
  { path: 'goal', redirectTo: 'goal/step1', pathMatch: 'full' },

  { path: '**', redirectTo: '' }, 
];
