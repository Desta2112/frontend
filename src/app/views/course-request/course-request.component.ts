import { Component, OnInit } from '@angular/core';
import { APIServiceService } from '../../../cores/services/apiservice.service';
import { AuthService } from '../../../cores/services/auth.service';
import { CourseRequest } from '../../../cores/models/courseRequest';
import { Materiial } from '../../../cores/models/Material';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-course-request',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './course-request.component.html',
  styleUrls: ['./course-request.component.scss'],
})
export class CourseRequestComponent implements OnInit {
  requests: CourseRequest[] = [];
  approvedCourses: string[] = [];
  materials: Materiial[] = [];
  feedback = '';
  userId!: string;
  currentUser: any;

  constructor(
    private apiService: APIServiceService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getUser(); // fetch current user
    console.log('Current User:', this.currentUser);
    console.log('User role:', this.currentUser?.role);

    this.loadUserRequests();
  }

  loadUserRequests() {
    if (!this.currentUser) {
      console.warn('Current user not found');
      return;
    }

    // ✅ FIX: role comes from roles array
    const isAdmin = this.currentUser.roles?.includes('Admin');

    this.apiService.getAllCourseRequests().subscribe({
      next: (requests) => {
        console.log('All course requests:', requests);
        console.log('Is Admin:', isAdmin);

        this.requests = isAdmin
          ? requests
          : requests.filter(
              (r: CourseRequest) => r.userId === this.currentUser.userId
            );

        console.log('Displayed requests:', this.requests);
      },
      error: (err) => console.error('Failed to fetch course requests', err),
    });
  }

  loadMaterials() {
    this.materials = [];
    for (const courseId of this.approvedCourses) {
      this.apiService.getMaterialsByCourse(courseId).subscribe((res) => {
        this.materials.push(...res);
      });
    }
  }

  // Apply to course (example)
  applyCourse(formData: FormData) {
    this.apiService.createCourseRequestWithReceipt(formData).subscribe(() => {
      this.loadUserRequests();
    });
  }

  // ADMIN actions
  approve(r: CourseRequest) {
    this.apiService
      .updateRequestStatus(r.requestId, 'Approved')
      .subscribe(() => this.loadUserRequests());
  }

  reject(r: CourseRequest) {
    if (!this.feedback) {
      alert('Feedback required');
      return;
    }
    this.apiService
      .updateRequestStatus(r.requestId, 'Rejected', this.feedback)
      .subscribe(() => {
        this.feedback = '';
        this.loadUserRequests();
      });
  }
}
