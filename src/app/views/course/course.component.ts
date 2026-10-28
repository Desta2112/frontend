import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Course } from '../../../cores/models/Course';
import { CourseTitle } from '../../../cores/models/CourseTitle';
import { Materiial } from '../../../cores/models/Material';
import { APIServiceService } from '../../../cores/services/apiservice.service';
import { AuthService } from '../../../cores/services/auth.service';
import {
  ModalModule,
  ModalComponent,
  ModalHeaderComponent,
  ModalBodyComponent,
  ModalFooterComponent,
  CardBodyComponent,
  CardComponent,
  CardHeaderComponent,
  ButtonModule,
} from '@coreui/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CourseRequest } from '../../../cores/models/courseRequest';
import { SafeUrlPipe } from '../../../cores/services/safe-url.pipe';

@Component({
  selector: 'app-course',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardBodyComponent,
    CardComponent,
    CardHeaderComponent,
    ButtonModule,
    ModalModule,
    ModalComponent,
    ModalHeaderComponent,
    ModalBodyComponent,
    ModalFooterComponent,
    SafeUrlPipe,
  ],
  templateUrl: './course.component.html',
})
export class CourseComponent implements OnInit {
  courses: Course[] = [];

  newCourse: Course = this.resetCourse();
  showModal = false;
  editingCourse = false;

  selectedCourse: Course | null = null;
  newCourseTitle: CourseTitle = this.resetCourseTitle();
  showTitleModal = false;

  selectedTitle: CourseTitle | null = null;
  newMaterial: Materiial = this.resetMaterial();
  showMaterialModal = false;
  selectedFile: File | null = null;

  previewFile: Materiial | null = null;

  showApplyModal = false;
  receiptFile: File | null = null;
  newCourseRequest: Partial<CourseRequest> = {};

  constructor(
    public apiService: APIServiceService,
    private sanitizer: DomSanitizer,
    public authService: AuthService
  ) {}
  courseRequestStatus: { [key: string]: string } = {}; // store status per course

  ngOnInit(): void {
    this.getAllCourses();
  }
  getAllCourses(): void {
    this.apiService.getAllCourses().subscribe((c: Course[]) => {
      this.courses = c.map((course) => ({
        ...course,
        showTitles: false,
        courseTitles: course.courseTitles || [],
      }));

      // Load course requests after courses are available
      this.loadCourseRequests();
    });
  }

  loadCourseRequests(): void {
    const user = this.authService.getUser();
    if (!user?.userId) return;

    this.courses.forEach((course) => {
      this.apiService
        .getCourseRequestStatus(user.userId, course.courseId)
        .subscribe({
          next: (res) => {
            this.courseRequestStatus[course.courseId] = res.status;
            console.log('Course', course.courseId, 'status:', res.status);
          },
          error: () => {
            this.courseRequestStatus[course.courseId] = 'None';
          },
        });
    });
  }

  isApproved(courseId: string): boolean {
    const status = this.courseRequestStatus[courseId];
    console.log(`Course ${courseId} status:`, status); // debug log
    return status?.trim().toLowerCase() === 'approved';
  }

  openModal(course?: Course): void {
    if (course) {
      this.editingCourse = true;
      this.newCourse = { ...course };
    } else {
      this.editingCourse = false;
      this.newCourse = this.resetCourse();
    }
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.editingCourse = false;
    this.newCourse = this.resetCourse();
  }

  resetCourse(): Course {
    return {
      courseId: '',
      courseName: '',
      description: '',
      price: 0,
      courseTitles: [],
    };
  }

  addCourse(): void {
    this.apiService.createCourse(this.newCourse).subscribe((res) => {
      this.courses.push({ ...res, showTitles: false, courseTitles: [] });
      this.closeModal();
    });
  }

  updateCourse(): void {
    if (!this.newCourse.courseId) return;
    this.apiService
      .updateCourse(this.newCourse.courseId, this.newCourse)
      .subscribe(() => {
        const index = this.courses.findIndex(
          (c) => c.courseId === this.newCourse.courseId
        );
        if (index !== -1) {
          this.courses[index] = {
            ...this.newCourse,
            showTitles: this.courses[index].showTitles,
            courseTitles: this.courses[index].courseTitles || [],
          };
        }
        this.closeModal();
      });
  }

  deleteCourse(courseId: string): void {
    if (!confirm('Are you sure to delete this course?')) return;
    this.apiService.deleteCourse(courseId).subscribe(() => {
      this.courses = this.courses.filter((c) => c.courseId !== courseId);
    });
  }

  toggleTitles(course: Course): void {
    course.showTitles = !course.showTitles;
    if (course.showTitles && !course.courseTitles?.length) {
      this.apiService
        .getAllCourseTitles()
        .subscribe((titles: CourseTitle[]) => {
          course.courseTitles = titles.filter(
            (t) => t.courseId === course.courseId
          );

          course.courseTitles.forEach((title: CourseTitle) => {
            this.apiService
              .getMaterialsByCourse(title.courseId)
              .subscribe((mats: Materiial[]) => {
                title.materials = mats.filter(
                  (m) => m.courseTitleId === title.courseTitleId
                );

                // Assign view URLs
                title.materials.forEach((m: Materiial) => {
                  m.fileUrl = this.apiService.getMaterialViewUrl(m.materialId);
                });
              });
          });
        });
    }
  }

  editCourse(course: Course): void {
    this.editingCourse = true;
    this.newCourse = { ...course };
    this.showModal = true;
  }

  /** ---------------- COURSE TITLES ---------------- */
  openAddTitleModal(course: Course): void {
    this.selectedCourse = course;
    this.newCourseTitle = this.resetCourseTitle(course);
    this.showTitleModal = true;
  }

  closeAddTitleModal(): void {
    this.showTitleModal = false;
    this.selectedCourse = null;
  }

  resetCourseTitle(course?: Course): CourseTitle {
    return {
      courseTitleId: '',
      titleName: '',
      courseId: course?.courseId ?? '',
      courseName: course?.courseName ?? '',
      materials: [],
    };
  }

  addCourseTitle(): void {
    if (!this.selectedCourse) return;
    this.apiService.createCourseTitle(this.newCourseTitle).subscribe((res) => {
      this.selectedCourse!.courseTitles =
        this.selectedCourse!.courseTitles || [];
      this.selectedCourse!.courseTitles.push(res);
      this.closeAddTitleModal();
    });
  }

  deleteCourseTitle(title: CourseTitle): void {
    if (!confirm('Are you sure to delete this title?')) return;
    this.apiService.deleteCourseTitle(title.courseTitleId).subscribe(() => {
      this.selectedCourse!.courseTitles =
        this.selectedCourse!.courseTitles.filter(
          (t) => t.courseTitleId !== title.courseTitleId
        );
    });
  }

  /** ---------------- MATERIALS ---------------- */
  openAddMaterialModal(title: CourseTitle): void {
    this.selectedTitle = title;
    this.newMaterial = this.resetMaterial(title);
    this.selectedFile = null;
    this.showMaterialModal = true;
  }

  closeAddMaterialModal(): void {
    this.showMaterialModal = false;
    this.selectedFile = null;
    this.selectedTitle = null;
  }

  resetMaterial(title?: CourseTitle): Materiial {
    return {
      materialId: '',
      courseTitleId: title?.courseTitleId ?? '',
      courseName: title?.courseName ?? '',
      titleName: title?.titleName ?? '',
      fileName: '',
      fileUrl: '',
      type: '',
    };
  }

  onFileSelected(event: any): void {
    const file: File | undefined = event.target.files?.[0];
    if (file) {
      this.selectedFile = file;
      this.newMaterial.fileName = file.name;
      this.newMaterial.type = file.type;
    }
  }

  uploadMaterial(): void {
    if (!this.selectedFile || !this.selectedTitle) return;

    // Prepare the material object with title ID
    this.newMaterial.courseTitleId = this.selectedTitle.courseTitleId;

    // Call API service
    this.apiService
      .uploadMaterial(this.newMaterial, this.selectedFile)
      .subscribe({
        next: (res: Materiial) => {
          // Ensure materials array exists
          this.selectedTitle!.materials = this.selectedTitle!.materials || [];

          // Assign the view URL from API service
          res.fileUrl = this.apiService.getMaterialViewUrl(res.materialId);

          // Push uploaded material to the selected title
          this.selectedTitle!.materials.push(res);

          // Close modal
          this.closeAddMaterialModal();
        },
        error: (err) => {
          console.error('Material upload failed:', err);
          alert('Failed to upload material.');
        },
      });
  }

  deleteMaterial(title: CourseTitle, material: Materiial): void {
    if (!confirm('Delete this material?')) return;
    this.apiService.deleteMaterial(material.materialId).subscribe(() => {
      title.materials = title.materials.filter(
        (m) => m.materialId !== material.materialId
      );
    });
  }

  /** ---------------- APPLY COURSE ---------------- */
  openApplyModal(course: Course): void {
    this.selectedCourse = course;
    this.showApplyModal = true;
    this.receiptFile = null;
    this.newCourseRequest = {
      courseId: course.courseId,
      userId: this.authService.getUser()?.userId,
      status: 'Pending',
    };
  }

  onReceiptSelected(event: any): void {
    if (event.target.files.length > 0) this.receiptFile = event.target.files[0];
  }

  applyCourse(): void {
    if (!this.selectedCourse || !this.receiptFile) return;
    const user = this.authService.getUser();
    if (!user?.userId) {
      alert('You must be logged in to apply for a course.');
      return;
    }

    const formData = new FormData();
    formData.append('CourseId', this.selectedCourse.courseId);
    formData.append('UserId', user.userId);
    formData.append('Receipt', this.receiptFile);

    this.apiService.createCourseRequestWithReceipt(formData).subscribe({
      next: () => {
        alert('Course application submitted successfully!');
        this.showApplyModal = false;
      },
      error: (err) => {
        console.error(err);
        alert('Failed to submit course application.');
      },
    });
  }

  /** ---------------- PREVIEW / DOWNLOAD ---------------- */
  openPreview(material: Materiial): void {
    if (!material) return;
    this.previewFile = { ...material };
    this.previewFile.fileUrl = this.apiService.getMaterialViewUrl(
      material.materialId
    );
  }

  closePreview(): void {
    this.previewFile = null;
  }

  getSafeUrl(url?: string): SafeResourceUrl {
    return url ? this.sanitizer.bypassSecurityTrustResourceUrl(url) : '';
  }

  downloadMaterial(material: Materiial): void {
    if (!material) return;
    const downloadUrl = this.apiService.getMaterialDownloadUrl(
      material.materialId
    );
    window.open(downloadUrl, '_blank');
  }

  /** ---------------- HELPER ---------------- */
  isUnsupportedPreview(material: Materiial | null): boolean {
    if (!material?.type) return true;
    const supported = ['pdf', 'video', 'image'];
    return !supported.some((ext) => material.type.includes(ext));
  }
  // Open Apply Modal with authentication check
  onApplyClick(course: Course) {
    const user = this.authService.getUser();
    if (!user?.userId) {
      alert('You must be logged in to apply for a course.');
      return;
    }
    this.openApplyModal(course);
  }

  // Open Apply Modal
  // openApplyModal(course: Course) {
  //   this.selectedCourse = course;
  //   this.showApplyModal = true;
  //   this.receiptFile = null;
  //   this.newCourseRequest = {
  //     courseId: course.courseId,
  //     userId: this.authService.getUser()?.userId,
  //     status: 'Pending',
  //   };
  // }

  // Apply Course
  // applyCourse() {
  //   if (!this.selectedCourse || !this.receiptFile) return;
  //   const user = this.authService.getUser();
  //   if (!user?.userId) {
  //     alert('You must be logged in to apply for a course.');
  //     return;
  //   }

  // const formData = new FormData();
  // formData.append('CourseId', this.selectedCourse.courseId);
  // formData.append('UserId', user.userId);
  // formData.append('Receipt', this.receiptFile);

  // this.apiService.createCourseRequestWithReceipt(formData).subscribe({
  //   next: () => {
  //     alert('Course application submitted successfully!');
  //     this.showApplyModal = false;
  //   },
  //   error: (err) => {
  //     console.error(err);
  //     alert('Failed to submit course application.');
  //   },
  // });
}

// Edit Course (opens modal)
// editCourse(course: Course) {
//   this.editingCourse = true;
//   this.newCourse = { ...course };
//   this.showModal = true;
