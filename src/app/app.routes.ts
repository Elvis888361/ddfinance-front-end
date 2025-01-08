import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { PolicyFormComponent } from './components/policy-form/policy-form.component';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'policies/new', component: PolicyFormComponent },
  { path: 'policies/edit/:id', component: PolicyFormComponent }
];
