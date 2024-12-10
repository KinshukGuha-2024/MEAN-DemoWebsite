import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  isDashboardActive: boolean = false;
  isDonationActive: boolean = false;


  constructor(private router: Router) {}

  ngOnInit(): void {

    const currentRoute = this.router.url;
    if (currentRoute === '/donation') {
      this.isDonationActive = true;
    }
    else if(currentRoute === '/student/dashboard'){
      this.isDashboardActive = true;
    }
  }
}
