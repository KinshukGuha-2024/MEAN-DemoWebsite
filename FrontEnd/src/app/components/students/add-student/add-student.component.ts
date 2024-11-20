
import { Component } from '@angular/core';
import { HeaderComponent } from '../../page_utilities/header/header.component';
import { FooterComponent } from '../../page_utilities/footer/footer.component';
import { SidebarComponent } from '../../page_utilities/sidebar/sidebar.component';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm, NgModel } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { config } from '../../../../config';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';








@Component({
  selector: 'app-add-student',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterOutlet, RouterLink, HeaderComponent, FooterComponent, SidebarComponent, HttpClientModule],
  templateUrl: './add-student.component.html',
  styleUrl: './add-student.component.css'
})


export class AddStudentComponent {
  imagePreview: string | ArrayBuffer | null = null;

  imagedata: string | ArrayBuffer | null = null;

  firstName: string = '';
  lastName: string = '';
  phoneNo: string = '';
  emailAddress: string = '';
  studentAddress: string = '';
  collegeYear: string ='';
  appliedCourses: string[] = [];
  studentId: string | null = null;

  // Array for courses to display the checkboxes dynamically
  courses: string[] = ['Course1', 'Course2', 'Course3'];
  studentStream: string = '';
  addInfo: string = '';
  studentImg: File | null = null;
  maxFileSize = 2 * 1024 * 1024;  // 2MB
  isRequired = true;


  isSubmitted = false;

  phonePattern: string = "^[0-9]{10}$";
  emailPattern: string = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$";

  constructor (private router: Router,private http: HttpClient,  private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Check the current URL path
    const currentUrl = this.router.url;

    // Check if the current URL matches the "student/update" route
    if (currentUrl.includes('student/update')) {
      this.studentId = this.route.snapshot.paramMap.get('id');
      const data = this.getStudentById()
      // console.log(data)
    } 
  }

  onCheckboxChange(course: string, event: Event) {
    // Cast event.target to HTMLInputElement
    const target = event.target as HTMLInputElement;

    // Get the checked state of the checkbox
    const isChecked = target.checked;

    if (isChecked) {
      this.appliedCourses.push(course);  // Add the course when checked
    } else {
      const index = this.appliedCourses.indexOf(course);
      if (index > -1) {
        this.appliedCourses.splice(index, 1);  // Remove the course when unchecked
      }
    }
  }

  onFileSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;

    if (fileInput?.files && fileInput.files[0]) {
      const file = fileInput.files[0];

      // Validate file type (optional)
      if (!file.type.startsWith('image/')) {
        alert('Please upload a valid image file.');
        return;
      }

      // Create a FileReader to read the file
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result; // Set the image preview
      };

      // Read the file as a Data URL
      reader.readAsDataURL(file);
    }
  }

  removeFile(): void {
    // Clear the image preview
    this.imagePreview = null;

    this.studentImg = null;
    // Reset the file input field
    const fileInput = document.getElementById('image') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = ''; // Reset the file input to empty
    }
  }

  onSubmit(form: NgForm, submitType: string = 'add', studentData: any = []) {
    this.isSubmitted = true;
    if (form.valid) {
        if(submitType === 'add') {
          this.registerStudent();
        }
        else {
          this.updateStudent();
        }
    } 
  }

  isBase64Image(imageString: string): boolean {
    // Regular expression to match base64 image format (with proper data URI)
    const base64ImagePattern = /^data:image\/([a-zA-Z0-9]+);base64,[A-Za-z0-9+/=]+$/;
    return base64ImagePattern.test(imageString);
  }

  registerStudent() {
    const data = {
      first_name: this.firstName,
      last_name: this.lastName,
      address: this.studentAddress,
      phone: this.phoneNo,
      email: this.emailAddress,
      year: this.collegeYear,
      applied_courses: this.appliedCourses,
      stream: this.studentStream,
      image: this.imagePreview,
      information: this.addInfo

    };

    this.http.post(`${config.apiUrl}student`, data).subscribe(
        (resultData: any) => {
          if(!resultData.error){
            alert("Student Registered Successfully..");
            this.firstName = '';
            this.lastName = '';
            this.studentAddress = '';
            this.phoneNo = '';
            this.emailAddress = '';
            this.collegeYear = '';
            this.appliedCourses = [];
            this.imagePreview=null;
            this.studentStream = '';
            this.addInfo = '';
            this.router.navigate(['/']);
          }
          else {
            alert("Student Registration Failed..");
          }
        },
        (error) => {
          console.error('Error registering student:', error);
        }
    )
  };

  updateStudent() {
    console.log("hh")
    let imageData = '';

    if (this.imagePreview) {
        // Check if it's already a base64 string
        if (typeof this.imagePreview === 'string' && this.isBase64Image(this.imagePreview)) {
            imageData = this.imagePreview;  // It's already base64
        }
        // If it's an ArrayBuffer, convert it to a base64 string
        
    }
    const data = {
        studentId: this.studentId,
        first_name: this.firstName,
        last_name: this.lastName,
        address: this.studentAddress,
        phone: this.phoneNo,
        email: this.emailAddress,
        year: this.collegeYear,
        applied_courses: this.appliedCourses,
        stream: this.studentStream,
        image: imageData,  // Ensure it's a string if it's not null
        information: this.addInfo
    };

    console.log(data);
    
    this.isRequired = false;

    this.http.post(`${config.apiUrl}student/update`, data).subscribe(
        (resultData: any) => {
            if (!resultData.error) {
                alert("Student Updated Successfully..");
                this.clearForm();
                this.router.navigate(['/']);
            } else {
                alert("Student Updation Failed..");
            }
        },
        (error) => {
            console.error('Error Updating student:', error);
        }
    );
  }

  getStudentById() {
    // Make sure to format the query correctly: ?studentId=<studentId_value>
    this.http.get(`${config.apiUrl}student/?studentId=${this.studentId}`).subscribe(
      (resultData: any) => {
        if (!resultData.error) {
            this.firstName = resultData.data.first_name;
            this.lastName = resultData.data.last_name;
            this.studentAddress = resultData.data.address;
            this.phoneNo = resultData.data.phone;
            this.emailAddress = resultData.data.email;
            this.collegeYear = resultData.data.year;
            this.appliedCourses = resultData.data.applied_courses;
            this.imagePreview= config.apiUrl + resultData.data.image;
            this.studentStream = resultData.data.stream;
            this.addInfo = resultData.data.information;

        } else {
          alert("Error fetching student.");
        }
      },
      (error) => {
        console.error('Error fetching student:', error);
        alert("Error fetching student data.");
      }
    );
  }
  clearForm() {
    this.studentId = '';
    this.firstName = '';
    this.lastName = '';
    this.studentAddress = '';
    this.phoneNo = '';
    this.emailAddress = '';
    this.collegeYear = '';
    this.appliedCourses = [];
    this.imagePreview = null;
    this.studentStream = '';
    this.addInfo = '';
  }



  
}
