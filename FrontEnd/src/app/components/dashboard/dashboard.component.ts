import { Component } from '@angular/core';
// import { RouterLink, RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../page_utilities/header/header.component';
import { FooterComponent } from '../page_utilities/footer/footer.component';
import { SidebarComponent } from '../page_utilities/sidebar/sidebar.component';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { config } from '../../../config';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';






@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, HeaderComponent, FooterComponent, SidebarComponent, HttpClientModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})


export class DashboardComponent {
  students: any[] = [];
  localStorageData: any;
  user_name: string ='';
  message: string | null = null;

  constructor(private router: Router, private http: HttpClient, private route: ActivatedRoute) {}
  
  ngOnInit(): void {
    this.get_students(); 
    this.route.queryParams.subscribe(params => {
      this.message = params['message'] || null;
    });

    const storedData = localStorage.getItem('userData');

    if (storedData) {
      this.localStorageData = JSON.parse(storedData); // Parse JSON string
      this.user_name = this.localStorageData.name;        // Access the 'name' property
    }
    // this.userName = userData.name;
    
  }
  

  get_students() {
    this.http.get(`${config.apiUrl}student`).subscribe(
        (resultData: any) => {
            // Check if data exists and handle accordingly
            if (!resultData.error) {
                this.students = resultData.data || []; // Assign empty array if no data is provided
                
            } else {
                console.log(resultData.message)
            }
        },
        (error) => {
            console.error('Error fetching students:', error);
            alert("Error fetching student data.");
        }
    );
  }



  deleteStudent(student: any) {
  
    const name = student.first_name.trim() + ' ' + student.last_name.trim(); 
    const data = {
      id: student._id,
      userName: name
    }; 

    console.log(data);

    var deleteTxt = "Are You Sure You Want To Delete " + data.userName + " ?"
    
    if(confirm(deleteTxt)){

      this.http.post(`${config.apiUrl}student/delete`, data).subscribe(
        (resultData: any) => {
          console.log(resultData);
          if(!resultData.error){

            var alertMsg = "Student "+ data.userName +" Deleted Successfully.."
            alert(alertMsg);
            this.get_students();
          }
          else {
            alert("Student Deletion Failed..");
          }
        },
        (error) => {
          console.error('Error registering student:', error);
        }
      )
    }

  };
}
