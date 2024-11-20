import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    
    // Check if 'userData' exists in localStorage
    const userData = localStorage.getItem('userData');
    
    // If user data exists and user is trying to access the login page, redirect to dashboard
    if (userData) {
      // If route is 'student/login', redirect to 'student/dashboard'
      if (route.routeConfig?.path === 'student/login') {
        this.router.navigate(['/student/dashboard']); // Redirect to dashboard
        return false; // Prevent accessing the login page
      }

      // Parse the stringified data to access the object properties
      const parsedUserData = JSON.parse(userData);
      const currentTime = new Date().getTime(); // Get current time in milliseconds

      // If "Remember Me" is not selected, and the data is expired
      if (!parsedUserData.remember_me && parsedUserData.expiry && currentTime > parsedUserData.expiry) {
        this.logout(); // Expired, log out the user
        return false;
      }

      // If user data exists and is valid, allow access to protected routes
      return true;
    } else {
      // If no user data, redirect to login page if trying to access any route except 'student/login'
      if (route.routeConfig?.path !== 'student/login') {
        this.router.navigate(['/student/login'],  { queryParams: { message: 'Please Login Again' } });
      }
      return false;
    }
  }

  logout(): void {
    localStorage.removeItem('userData'); // Clear user data from localStorage
    this.router.navigate(['/student/login'],  { queryParams: { message: 'Please Login Again' } }); // Redirect to the login page
  }
}
