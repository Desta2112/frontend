import { Answer } from '../models/Answer';
export interface Question {
  questionId: string;
  userId: string;
  firstName: string;
  lastName: string;
  descriptin: string;
  tag: string;
  createdAt: string;
  answers?: Answer[];
}
