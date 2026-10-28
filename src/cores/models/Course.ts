export interface Course {
  courseId: string;
  courseName: string;
  description: string;
  price: number;
  courseTitles: any[];
  showTitles?: boolean; // <-- ADD THIS
  //requestStatus?: string;
}
