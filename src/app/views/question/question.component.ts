// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { APIServiceService } from '../../../cores/services/apiservice.service';
// import { AuthService } from '../../../cores/services/auth.service';
// import { Question } from '../../../cores/models/Question';
// import { Answer } from '../../../cores/models/Answer';

// @Component({
//   selector: 'app-question',
//   standalone: true,
//   imports: [CommonModule, FormsModule],
//   templateUrl: './question.component.html',
//   styleUrls: ['./question.component.scss'],
// })
// export class QuestionComponent implements OnInit {
//   questionlist: Question[] = [];
//   pagedQuestions: Question[] = []; // questions to display on current page
//   openedIndex: number | null = null;

//   // Modal states
//   isAddModalOpen: boolean = false;
//   isEditModalOpen: boolean = false;
//   isAddAnswerModalOpen: boolean = false;

//   addData: Question = {} as Question;
//   editData: Question = {} as Question;

//   selectedQuestion: Question | null = null;
//   answerData: Answer = {} as Answer;

//   // Pagination
//   currentPage: number = 1;
//   pageSize: number = 5; // number of questions per page

//   constructor(
//     private apiService: APIServiceService,
//     public authService: AuthService
//   ) {}

//   ngOnInit(): void {
//     this.loadQuestions();
//   }

//   // Load all questions sorted by CreatedAt (newest first)
//   loadQuestions() {
//     this.apiService.getAllQuestions().subscribe({
//       next: (data) => {
//         this.questionlist = data
//           .map((q: any) => ({
//             ...q,
//             answers: q.answers || [],
//           }))
//           .sort(
//             (a: any, b: any) =>
//               new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
//           );

//         this.setPage(this.currentPage); // initialize pagination
//       },
//       error: (err) => console.error(err),
//     });
//   }

//   get totalPages(): number {
//     return Math.ceil(this.questionlist.length / this.pageSize);
//   }

//   // Pagination: update pagedQuestions for current page
//   setPage(page: number) {
//     this.currentPage = page;
//     const start = (page - 1) * this.pageSize;
//     const end = start + this.pageSize;
//     this.pagedQuestions = this.questionlist.slice(start, end);
//   }

//   nextPage() {
//     if (
//       this.currentPage < Math.ceil(this.questionlist.length / this.pageSize)
//     ) {
//       this.setPage(this.currentPage + 1);
//     }
//   }

//   prevPage() {
//     if (this.currentPage > 1) {
//       this.setPage(this.currentPage - 1);
//     }
//   }

//   // Toggle question body
//   toggle(index: number) {
//     this.openedIndex = this.openedIndex === index ? null : index;
//   }

//   // Open Add Modal
//   openAddModal() {
//     if (!this.authService.isAuthenticated()) {
//       alert('You must login first!');
//       return;
//     }

//     const user = this.authService.getUser();
//     this.addData = {
//       questionId: '',
//       userId: user.userId,
//       firstName: user.firstName,
//       lastName: user.lastName,
//       tag: '',
//       descriptin: '',
//       answers: [],
//       createdAt: new Date().toISOString(),
//     };

//     this.isAddModalOpen = true;
//   }

//   closeAddModal() {
//     this.isAddModalOpen = false;
//   }

//   addQuestion() {
//     this.apiService.createQuestion(this.addData).subscribe({
//       next: () => {
//         alert('Question added!');
//         this.closeAddModal();
//         this.loadQuestions();
//       },
//       error: (err) => console.error(err),
//     });
//   }

//   // Edit Question
//   editQuestion(q: Question) {
//     this.editData = { ...q };
//     this.isEditModalOpen = true;
//   }

//   closeEditModal() {
//     this.isEditModalOpen = false;
//   }

//   updateQuestion() {
//     this.apiService
//       .updateQuestion(this.editData.questionId, this.editData)
//       .subscribe({
//         next: () => {
//           alert('Question updated!');
//           this.closeEditModal();
//           this.loadQuestions();
//         },
//         error: (err) => console.error(err),
//       });
//   }

//   // Delete Question
//   deleteQuestion(q: Question) {
//     if (confirm('Are you sure you want to delete this question?')) {
//       this.apiService.deleteQuestion(q.questionId).subscribe({
//         next: () => {
//           alert('Question deleted!');
//           this.loadQuestions();
//         },
//         error: (err) => console.error(err),
//       });
//     }
//   }

//   // --- Answer Handling ---
//   openAddAnswerModal(question: Question) {
//     if (!this.authService.isAuthenticated()) {
//       alert('You must login first!');
//       return;
//     }

//     this.selectedQuestion = question;

//     this.answerData = {
//       answerId: undefined,
//       userId: this.authService.getUser().userId,
//       firstName: this.authService.getUser().firstName,
//       lastName: this.authService.getUser().lastName,
//       questionId: question.questionId,
//       descriptin: question.descriptin,
//       answerText: '',
//     };

//     this.isAddAnswerModalOpen = true;
//   }

//   closeAddAnswerModal() {
//     this.isAddAnswerModalOpen = false;
//     this.selectedQuestion = null;
//   }

//   submitAnswer() {
//     if (!this.answerData.answerText.trim()) {
//       alert('Answer cannot be empty!');
//       return;
//     }

//     this.apiService.createAnswer(this.answerData).subscribe({
//       next: (res: Answer) => {
//         if (this.selectedQuestion) {
//           if (!this.selectedQuestion.answers) {
//             this.selectedQuestion.answers = [];
//           }
//           this.selectedQuestion.answers.push(res);
//         }
//         this.closeAddAnswerModal();
//       },
//       error: (err) => console.error(err),
//     });
//   }
// }
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { APIServiceService } from '../../../cores/services/apiservice.service';
import { AuthService } from '../../../cores/services/auth.service';
import { Question } from '../../../cores/models/Question';
import { Answer } from '../../../cores/models/Answer';

@Component({
  selector: 'app-question',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss'],
})
export class QuestionComponent implements OnInit {
  questionlist: Question[] = [];
  filteredQuestions: Question[] = [];
  pagedQuestions: Question[] = [];
  openedIndex: number | null = null;

  // Modal states
  isAddModalOpen: boolean = false;
  isEditModalOpen: boolean = false;
  isAddAnswerModalOpen: boolean = false;

  addData: Question = {} as Question;
  editData: Question = {} as Question;
  selectedQuestion: Question | null = null;
  answerData: Answer = {} as Answer;

  // Pagination
  currentPage: number = 1;
  pageSize: number = 5;
  totalPages: number = 1;

  // Search
  searchTag: string = '';

  constructor(
    private apiService: APIServiceService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadQuestions();
  }

  // Load all questions sorted by createdAt
  loadQuestions() {
    this.apiService.getAllQuestions().subscribe({
      next: (data) => {
        this.questionlist = data
          .map((q: any) => ({ ...q, answers: q.answers || [] }))
          .sort(
            (a: any, b: any) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );

        // Initialize filteredQuestions and pagination
        this.filteredQuestions = [...this.questionlist];
        this.totalPages = Math.ceil(
          this.filteredQuestions.length / this.pageSize
        );
        this.updatePagedQuestions();
      },
      error: (err) => console.error(err),
    });
  }

  // Filter questions by tag
  filterQuestions() {
    if (this.searchTag.trim() === '') {
      this.filteredQuestions = [...this.questionlist];
    } else {
      this.filteredQuestions = this.questionlist.filter((q) =>
        q.tag.toLowerCase().includes(this.searchTag.toLowerCase())
      );
    }
    this.currentPage = 1;
    this.totalPages = Math.ceil(this.filteredQuestions.length / this.pageSize);
    this.updatePagedQuestions();
  }

  // Update paged questions
  updatePagedQuestions() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    this.pagedQuestions = this.filteredQuestions.slice(
      startIndex,
      startIndex + this.pageSize
    );
  }

  // Pagination functions
  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagedQuestions();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagedQuestions();
    }
  }

  goToPage(page: number) {
    this.currentPage = page;
    this.updatePagedQuestions();
  }

  toggle(index: number) {
    this.openedIndex = this.openedIndex === index ? null : index;
  }

  // --- Add / Edit Question ---
  openAddModal() {
    if (!this.authService.isAuthenticated()) {
      alert('You must login first!');
      return;
    }

    const user = this.authService.getUser();
    this.addData = {
      questionId: '',
      userId: user.userId,
      firstName: user.firstName,
      lastName: user.lastName,
      tag: '',
      descriptin: '',
      answers: [],
      createdAt: new Date().toISOString(),
    };

    this.isAddModalOpen = true;
  }

  closeAddModal() {
    this.isAddModalOpen = false;
  }

  addQuestion() {
    this.apiService.createQuestion(this.addData).subscribe({
      next: () => {
        alert('Question added!');
        this.closeAddModal();
        this.loadQuestions();
      },
      error: (err) => console.error(err),
    });
  }

  editQuestion(q: Question) {
    this.editData = { ...q };
    this.isEditModalOpen = true;
  }

  closeEditModal() {
    this.isEditModalOpen = false;
  }

  updateQuestion() {
    this.apiService
      .updateQuestion(this.editData.questionId, this.editData)
      .subscribe({
        next: () => {
          alert('Question updated!');
          this.closeEditModal();
          this.loadQuestions();
        },
        error: (err) => console.error(err),
      });
  }

  deleteQuestion(q: Question) {
    if (confirm('Are you sure you want to delete this question?')) {
      this.apiService.deleteQuestion(q.questionId).subscribe({
        next: () => {
          alert('Question deleted!');
          this.loadQuestions();
        },
        error: (err) => console.error(err),
      });
    }
  }

  // --- Answer Handling ---
  openAddAnswerModal(question: Question) {
    if (!this.authService.isAuthenticated()) {
      alert('You must login first!');
      return;
    }

    this.selectedQuestion = question;

    this.answerData = {
      answerId: undefined,
      userId: this.authService.getUser().userId,
      firstName: this.authService.getUser().firstName,
      lastName: this.authService.getUser().lastName,
      questionId: question.questionId,
      descriptin: question.descriptin,
      answerText: '',
    };

    this.isAddAnswerModalOpen = true;
  }

  closeAddAnswerModal() {
    this.isAddAnswerModalOpen = false;
    this.selectedQuestion = null;
  }

  submitAnswer() {
    if (!this.answerData.answerText.trim()) {
      alert('Answer cannot be empty!');
      return;
    }

    this.apiService.createAnswer(this.answerData).subscribe({
      next: (res: Answer) => {
        if (this.selectedQuestion) {
          if (!this.selectedQuestion.answers) {
            this.selectedQuestion.answers = [];
          }
          this.selectedQuestion.answers.push(res);
        }
        this.closeAddAnswerModal();
      },
      error: (err) => console.error(err),
    });
  }
}
