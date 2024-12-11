import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-success',
  standalone: true,
  imports: [],
  templateUrl: './success.component.html',
  styleUrl: './success.component.css'
})
export class SuccessComponent {
  data: any;  
  transaction_id: string = '';
  constructor(private router: Router, private activeRoute: ActivatedRoute) {}
  ngOnInit() {
    this.activeRoute.queryParams.subscribe(params => {
      this.transaction_id = params['key'] ? params['key'] : null;
      console.log('Received data:', this.transaction_id);
    });
  }
  navigateToDonation() {
    this.router.navigate(['/student/dashboard']);
  }
}
