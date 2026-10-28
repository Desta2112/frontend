import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environment';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { User, UserRegisterDto, UserRegisterResponse } from '../models/User';
import { Question } from '../models/Question';
import { Answer } from '../models/Answer';
import { AuthService } from './auth.service';
import { Course } from '../models/Course';
import { Materiial } from '../models/Material';
import { CourseTitle } from '../models/CourseTitle';
import { CourseRequest } from '../models/courseRequest';

@Injectable({
  providedIn: 'root',
})
export class APIServiceService {
  private apiUrl = environment.api;
  private courseTitleUrl = `${this.apiUrl}/CourseTitle`;

  constructor(
    private http: HttpClient,
    private router: Router,
    public authService: AuthService
  ) {}

  // Get total number of users
  getTotalUsers(): Observable<{ totalUsers: number }> {
    return this.http.get<{ totalUsers: number }>(`${this.apiUrl}/User/count`);
  }

  changePassword(payload: any) {
    return this.http.put(`${this.apiUrl}/User/change-password`, payload);
  }

  /** Send a reset link/token to the user’s email */
  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/User/forgot-password`, { email });
  }

  /** Complete password reset with token */
  resetPassword(payload: {
    email: string;
    token: string;
    newPassword: string;
  }): Observable<any> {
    return this.http.post(`${this.apiUrl}/User/reset-password`, payload);
  }

  registerUser(dto: UserRegisterDto): Observable<UserRegisterResponse> {
    return this.http.post<UserRegisterResponse>(
      `${this.apiUrl}/User/register`,
      dto
    );
  }
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/User`);
  }

  getUserById(id: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/User/${id}`);
  }

  updateUser(id: string, user: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/User/${id}`, user);
  }

  createRole(role: string) {
    return this.http.post<{ message: string }>(
      `${this.apiUrl}/Role/create`, // Capital "R"
      JSON.stringify(role),
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  getRoles() {
    return this.http.get<string[]>(`${this.apiUrl}/Role`);
  }

  // Permissions
  createPermission(dto: { permissionName: string }) {
    return this.http.post(`${this.apiUrl}/permissions/create`, dto);
  }

  getPermissions() {
    return this.http.get<string[]>(`${this.apiUrl}/permissions`);
  }
  getrolepermission(roleName: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/RolePermissions/${roleName}`);
  }
  // Assign Permissions to Role
  assignPermissionsToRole(dto: {
    roleName: string;
    permissions: string[];
  }): Observable<any> {
    return this.http.post(`${this.apiUrl}/rolepermissions/assign`, dto);
  }
  getAllUserPermissions(
    userId: string
  ): Observable<{ userPermissions: string[]; rolePermissions: string[] }> {
    return this.http.get<{
      userPermissions: string[];
      rolePermissions: string[];
    }>(`${this.apiUrl}/UserPermission/all-permissions/${userId}`);
  }

  // Assign Role to User
  assignRoleToUser(data: { username: string; role: string }) {
    return this.http.post(`${this.apiUrl}/userroles/assign`, data);
  }
  deleteRole(roleName: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/role/delete/${roleName}`);
  }
  deletepermission(name: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/Permissions/delete/${name}`);
  }

  removePermission(dto: { userId: string; permissionName: string }) {
    return this.http.post(`${this.apiUrl}/UserPermission/remove`, dto, {
      responseType: 'text',
    });
  }
  assignPermission(userId: string, permission: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/UserPermission/assign`, {
      userId,
      permissionNames: [permission], // must be an array
    });
  }

  getUserPermissions(userId: string) {
    return this.http.get<string[]>(`/api/UserPermission/${userId}`);
  }
  // Check if a user has a specific permission
  checkPermission(userId: string, permissionName: string): Observable<boolean> {
    return this.http.get<boolean>(
      `${this.apiUrl}/UserPermission/check?userId=${userId}&permissionName=${permissionName}`
    );
  }

  // Update user permissions by sending a POST request
  updateUserPermissions(dto: {
    userId: string;
    permissions: string[];
  }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/UserPermission/assign`, dto);
  }

  // ANSWERS -------------------------------------------------------------

  // ===================== ANSWERS API =====================

  // GET all answers
  getAllAnswers(): Observable<Answer[]> {
    return this.http.get<Answer[]>(`${this.apiUrl}/answer`);
  }

  // GET answer by ID
  getAnswerById(id: string): Observable<Answer> {
    return this.http.get<Answer>(`${this.apiUrl}/answer/${id}`);
  }

  // CREATE new answer
  createAnswer(answer: Answer): Observable<Answer> {
    return this.http.post<Answer>(`${this.apiUrl}/answer`, answer);
  }

  // UPDATE answer
  updateAnswer(id: string, answer: Answer): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/answer/${id}`, answer);
  }

  // DELETE answer
  deleteAnswer(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/answer/${id}`);
  }

  // ===================== QUESTIONS API =====================

  // GET all questions
  getAllQuestions(): Observable<Question[]> {
    return this.http.get<Question[]>(`${this.apiUrl}/question`);
  }

  // GET question by ID
  getQuestionById(id: string): Observable<Question> {
    return this.http.get<Question>(`${this.apiUrl}/question/${id}`);
  }

  // CREATE question (questionId will be ignored by backend)
  createQuestion(question: Question): Observable<Question> {
    return this.http.post<Question>(`${this.apiUrl}/question`, question);
  }

  // UPDATE question
  updateQuestion(id: string, question: Question): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/question/${id}`, question);
  }

  // DELETE question
  deleteQuestion(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/question/${id}`);
  }
  // get All Answers
  GetAllAnswers(): Observable<Answer[]> {
    return this.http.get<Answer[]>(`${this.apiUrl}/answer`);
  }
  // get All Courses
  // Get all courses
  getAllCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.apiUrl}/course`);
  }

  // Get course by ID
  getCourseById(id: string): Observable<Course> {
    return this.http.get<Course>(`${this.apiUrl}/course/${id}`);
  }

  // Create course
  createCourse(course: Course): Observable<Course> {
    return this.http.post<Course>(`${this.apiUrl}/course`, course);
  }

  // Update course
  updateCourse(id: string, course: Course): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/course/${id}`, course);
  }

  // Delete course
  deleteCourse(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/course/${id}`);
  }
  // ---------------- COURSE TITLE --------------------

  // GET all course titles
  getAllCourseTitles(): Observable<CourseTitle[]> {
    return this.http.get<CourseTitle[]>(this.courseTitleUrl);
  }

  // GET course title by ID
  getCourseTitleById(id: string): Observable<CourseTitle> {
    return this.http.get<CourseTitle>(`${this.courseTitleUrl}/${id}`);
  }

  // CREATE new course title
  createCourseTitle(courseTitle: CourseTitle): Observable<CourseTitle> {
    const payload = {
      courseId: courseTitle.courseId,
      titleName: courseTitle.titleName,
    };

    return this.http.post<CourseTitle>(this.courseTitleUrl, payload);
  }

  // UPDATE course title
  updateCourseTitle(id: string, courseTitle: CourseTitle): Observable<void> {
    const payload = {
      courseTitleId: id,
      courseId: courseTitle.courseId,
      titleName: courseTitle.titleName,
    };

    return this.http.put<void>(`${this.courseTitleUrl}/${id}`, payload);
  }

  // DELETE course title
  deleteCourseTitle(id: string): Observable<void> {
    return this.http.delete<void>(`${this.courseTitleUrl}/${id}`);
  }

  // ---------------- MATERIALS ------------------

  // Get all materials
  // Fetch materials by course (no approval needed)
  getMaterialsByCourse(courseId: string): Observable<Materiial[]> {
    return this.http.get<Materiial[]>(
      `${this.apiUrl}/material/course/${courseId}`
    );
  }

  // Download material
  getMaterialDownloadUrl(materialId: string): string {
    return `${this.apiUrl}/Material/download/${materialId}`;
  }

  // View material inline
  getMaterialViewUrl(materialId: string): string {
    return `${this.apiUrl}/Material/view/${materialId}`;
  }

  // Upload material
  uploadMaterial(material: Materiial, file: File): Observable<Materiial> {
    const formData = new FormData();
    formData.append('CourseTitleId', material.courseTitleId);
    formData.append('FileName', material.fileName);
    formData.append('File', file);

    return this.http.post<Materiial>(`${this.apiUrl}/material`, formData);
  }

  // Delete material
  deleteMaterial(materialId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/material/${materialId}`);
  }
  // Create request with receipt
  // Create course request with receipt (USER)
  createCourseRequestWithReceipt(
    formData: FormData
  ): Observable<CourseRequest> {
    return this.http.post<CourseRequest>(
      `${this.apiUrl}/CourseRequest/upload`,
      formData
    );
  }

  getRequestsByUser(userId: string): Observable<CourseRequest[]> {
    return this.http.get<CourseRequest[]>(
      `${this.apiUrl}/CourseRequest/user/${userId}`
    );
  }

  getPendingRequests(): Observable<CourseRequest[]> {
    return this.http.get<CourseRequest[]>(
      `${this.apiUrl}/CourseRequest/pending`
    );
  }
  getAllCourseRequests(): Observable<CourseRequest[]> {
    return this.http.get<CourseRequest[]>(`${this.apiUrl}/CourseRequest/all`);
  }

  updateRequestStatus(
    requestId: string,
    status: 'Approved' | 'Rejected',
    adminFeedback?: string
  ) {
    return this.http.put<void>(`${this.apiUrl}/CourseRequest/${requestId}`, {
      status,
      adminFeedback,
    });
  }

  // ===== MATERIAL =====
  // getMaterialsByCourse(courseId: string): Observable<Materiial[]> {
  //   return this.http.get<Materiial[]>(
  //     `${this.apiUrl}/Material/course/${courseId}`
  //   );
  // }

  getActiveUsersCount(): Observable<{ activeUsers: number }> {
    return this.http.get<{ activeUsers: number }>(
      `${this.apiUrl}/User/stats/active`
    );
  }
  getInactiveUsersCount(): Observable<{ inactiveUsers: number }> {
    return this.http.get<{ inactiveUsers: number }>(
      `${this.apiUrl}/User/stats/inactive`
    );
  }
  getQuestionChart(period: 'Day' | 'Week' | 'Month') {
    return this.http.get<{ label: string; count: number }[]>(
      `${this.apiUrl}/Question/stats/questions/chart?period=${period}`
    );
  }
  getCourseRequestStatus(userId: string, courseId: string) {
    return this.http.get<{ status: string }>(
      `${this.apiUrl}/CourseRequest/status/${userId}/${courseId}`
    );
  }
  // ===== COURSE REQUEST STATS =====
  getCourseRequestStats(): Observable<{ approved: number; pending: number }> {
    return this.http.get<{ approved: number; pending: number }>(
      `${this.apiUrl}/CourseRequest/stats`
    );
  }
}
