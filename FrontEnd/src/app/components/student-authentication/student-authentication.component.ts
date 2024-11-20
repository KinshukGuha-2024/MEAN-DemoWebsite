import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Component, model } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { config } from '../../../config';

const userData = localStorage.getItem('userData');
console.log(userData);


@Component({
  selector: 'app-student-authentication',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterOutlet, RouterLink, RouterLinkActive, HttpClientModule],
  templateUrl: './student-authentication.component.html',
  styleUrl: './student-authentication.component.css'
})




export class StudentAuthenticationComponent {
  emailAddress: string = '';
  password: string = '';
  message: string | null = null;
  
  isSubmitted = false; passwordVisible: boolean = false;

 

  emailPattern: string = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$";


  errorMessage: string | null = null;
  rememberMe: boolean = false;  // Changed to boolean for the checkbox

  constructor(private router: Router, private http: HttpClient, private route: ActivatedRoute) {}


  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.message = params['message'] || null;
    });
    // Check if this is a logout route
    const currentRoute = this.router.url;
    if (currentRoute === '/student/logout') {
      this.logout();
    }
  }

  // Method to toggle password visibility
  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

  onSubmit(form: NgForm) {
    this.isSubmitted = true;
    if (form.valid) {
      console.log("Form is valid");
      this.AuthCheck();
    } else {
      console.log("Form is invalid");
    }
  }

  AuthCheck() {
    const data = {
      email: this.emailAddress,
      password: this.password,
    };

    this.http.post(`${config.apiUrl}student/auth/login`, data).subscribe(
      (resultData: any) => {
        // console.log(resultData.data);
        // Check if login was successful
        if (resultData.success) {
          this.errorMessage = null;
          localStorage.setItem('userData',JSON.stringify({
            email: this.emailAddress,
            name: resultData.data.name,
            id: resultData.data.id,
            remember_me: this.rememberMe,
            expiry: this.rememberMe ? null : new Date().getTime() + 60000 // 86400000
          }));
          this.router.navigate(['/student/dashboard'], { queryParams: { message: 'Login successful' } });
          
        } else {
          // Show error message from the response
          this.errorMessage = resultData.message || 'An error occurred during login.';
        }
      },
      (error: any) => {
        // Handle HTTP errors (e.g., 400 or 500 status codes)
        console.error('HTTP error:', error);
        this.errorMessage = error.error?.message || 'An unexpected error occurred.';
      }
    );
    
  };


  logout(): void {
    localStorage.removeItem('userData');
    // console.log('localStorage after clear:', localStorage);
  
    this.router.navigate(['/student/login', { message: 'LogOut Successfull..' }]);
  }
  

  

  
}
