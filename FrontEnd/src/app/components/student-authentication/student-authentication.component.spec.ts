import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentAuthenticationComponent } from './student-authentication.component';

describe('StudentAuthenticationComponent', () => {
  let component: StudentAuthenticationComponent;
  let fixture: ComponentFixture<StudentAuthenticationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentAuthenticationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentAuthenticationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
