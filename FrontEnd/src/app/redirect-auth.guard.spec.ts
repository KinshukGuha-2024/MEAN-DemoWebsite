import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { redirectAuthGuard } from './redirect-auth.guard';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

describe('redirectAuthGuard', () => {
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Router]
    });

    router = TestBed.inject(Router);
  });

  it('should be created', () => {
    expect(redirectAuthGuard).toBeTruthy();
  });

  it('should redirect to dashboard if userData exists in localStorage', () => {
    // Set userData in localStorage
    localStorage.setItem('userData', JSON.stringify({}));

    // Mock route and state (not needed for logic, but required by CanActivateFn)
    const route = {} as ActivatedRouteSnapshot;
    const state = {} as RouterStateSnapshot;

    const canActivate = redirectAuthGuard(route, state);

    expect(canActivate).toBe(false); // The guard should return false to prevent access to the login page
    expect(router.navigate).toHaveBeenCalledWith(['/student/dashboard']); // Ensure the guard redirects to the dashboard
  });

  it('should allow access if userData does not exist in localStorage', () => {
    // Clear userData from localStorage
    localStorage.removeItem('userData');

    // Mock route and state (not needed for logic, but required by CanActivateFn)
    const route = {} as ActivatedRouteSnapshot;
    const state = {} as RouterStateSnapshot;

    const canActivate = redirectAuthGuard(route, state);

    expect(canActivate).toBe(true); // The guard should return true to allow access to the login page
  });
});
