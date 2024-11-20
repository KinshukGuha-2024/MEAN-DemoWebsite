import { inject } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { CanActivateFn } from '@angular/router';

export const redirectAuthGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const router = inject(Router); // Inject the router

  // Check if user data exists in localStorage
  const userData = localStorage.getItem('userData');

  if (userData) {
    // If user data exists, redirect to the dashboard
    router.navigate(['/student/dashboard']);
    return false; // Prevent access to the current route (e.g., login page)
  }

  // Allow access if no user data exists
  return true;
};
