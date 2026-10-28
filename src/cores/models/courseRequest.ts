export interface CourseRequest {
  requestId: string;
  userId: string;
  courseId: string;
  courseName?: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  receiptImageUrl?: string;
  adminFeedback?: string;
  userName?: string;
}
