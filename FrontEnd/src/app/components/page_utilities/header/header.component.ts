import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  localStorageData: any;
  user_name: string ='';

  constructor(private router: Router, private route: ActivatedRoute) {}

  
  ngOnInit(): void {
    const storedData = localStorage.getItem('userData');

    if (storedData) {
      this.localStorageData = JSON.parse(storedData); // Parse JSON string
      this.user_name = this.localStorageData.name;        // Access the 'name' property
    }
    // this.userName = userData.name;
    
  }

  logout(): void {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    
    if (confirmLogout) {
      localStorage.removeItem('userData');
      // console.log('localStorage after clear:', localStorage);
  
      this.router.navigate(['/student/login'], { queryParams: { message: 'Logout successful' } });
    }
  }
  
}
