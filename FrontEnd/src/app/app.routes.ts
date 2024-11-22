import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AddStudentComponent } from './components/students/add-student/add-student.component';
import { StudentAuthenticationComponent } from './components/student-authentication/student-authentication.component';
import { AuthGuard } from './auth.guard.spec';
import { redirectAuthGuard } from './redirect-auth.guard';
import { DonationComponent } from './components/donation/donation.component';


export const routes: Routes = [
  {
    path: 'student/dashboard',
    title: 'Demo Website | Dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard]  // Protect the route with AuthGuard
  },
  {
    path: 'student/add',
    title: 'Demo Website | Register-Student',
    component: AddStudentComponent,
    canActivate: [AuthGuard]  // Protect the route with AuthGuard
  },
  {
    path: 'student/update/:id',
    title: 'Demo Website | Update-Student',
    component: AddStudentComponent,
    canActivate: [AuthGuard]  // Protect the route with AuthGuard
  },
  {
    path: 'donation',
    title: 'Demo Website | Donate',
    component: DonationComponent,
    canActivate: [AuthGuard] 
  },
  {
    path: 'student/login',
    title: 'Demo Website | Login',
    component: StudentAuthenticationComponent,
    canActivate: [redirectAuthGuard], // Use RedirectGuard for login route
  },
  {
    path: '**',
    redirectTo: '/student/login' // Default redirect to login if the route doesn't exist
  },
  
];
