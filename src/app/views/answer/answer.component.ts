import { Component, OnInit } from '@angular/core';
import { APIServiceService } from '../../../cores/services/apiservice.service';
import { AuthService } from '../../../cores/services/auth.service';
import { Answer } from '../../../cores/models/Answer';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  CardBodyComponent,
  CardComponent,
  CardHeaderComponent,
  ButtonDirective,
} from '@coreui/angular';

@Component({
  selector: 'app-answer',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardBodyComponent,
    CardComponent,
    CardHeaderComponent,
    ButtonDirective,
  ],
  templateUrl: './answer.component.html',
  styleUrls: ['./answer.component.scss'],
})
export class AnswerComponent implements OnInit {
  answers: Answer[] = []; // full answer list
  filteredAnswers: Answer[] = []; // filtered answers by search
  pagedAnswers: Answer[] = []; // current page answers
  openedIndex: number | null = null;

  // Pagination
  currentPage: number = 1;
  pageSize: number = 5;
  totalPages: number = 1;

  // Search
  searchText: string = '';

  constructor(
    private apiService: APIServiceService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadAnswers();
  }

  loadAnswers() {
    this.apiService.getAllAnswers().subscribe({
      next: (res: Answer[]) => {
        this.answers = res;
        this.filteredAnswers = [...this.answers];
        this.totalPages = Math.ceil(
          this.filteredAnswers.length / this.pageSize
        );
        this.setPagedAnswers();
      },
      error: (err) => console.error(err),
    });
  }

  setPagedAnswers() {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.pagedAnswers = this.filteredAnswers.slice(start, end);
  }

  // Pagination controls
  goToPage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.setPagedAnswers();
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.setPagedAnswers();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.setPagedAnswers();
    }
  }

  toggle(index: number) {
    this.openedIndex = this.openedIndex === index ? null : index;
  }

  get pages(): number[] {
    return Array(this.totalPages)
      .fill(0)
      .map((_, i) => i + 1);
  }

  // --- Search Function ---
  filterAnswers() {
    const text = this.searchText.trim().toLowerCase();
    this.filteredAnswers = this.answers.filter((a) =>
      a.descriptin.toLowerCase().includes(text)
    );
    this.currentPage = 1;
    this.totalPages = Math.ceil(this.filteredAnswers.length / this.pageSize);
    this.setPagedAnswers();
  }
}
