import { Component, OnInit } from '@angular/core';
import { ExamResultService } from '../../services/exam-result.service';
import { UserService } from '../../services/user.service';
import { ExamService } from '../../services/exam.service';
import { forkJoin } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { saveAs } from 'file-saver'; // Import saveAs from file-saver
import { AdminNavbarComponent } from '../admin-navbar/admin-navbar.component';

@Component({
  selector: 'app-admin-result',
  templateUrl: './admin-result.component.html',
  styleUrls: ['./admin-result.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, AdminNavbarComponent]
})
export class AdminResultComponent implements OnInit {
  examResults: any[] = [];
  filteredResults: any[] = [];
  isLoading = true;
  errorMessage = '';
  searchTerm = '';
  currentPage = 1;
  pageSize = 5;
  sortField = 'percentage';
  sortAscending = true;
  percentageFilter: 'all' | 'top20' | 'top50' | 'bottom20' = 'all';

  constructor(
    private examResultService: ExamResultService,
    private userService: UserService,
    private examService: ExamService
  ) {}

  ngOnInit(): void {
    this.loadResults();
  }

  loadResults(): void {
    this.examResultService.getAllResults().subscribe(
      (results) => {
        const userRequests = results.map((result: any) =>
          this.userService.getUserById(result.userId)
        );

        const examRequests = results.map((result: any) =>
          this.examService.getExamById(result.examId)
        );

        forkJoin([forkJoin(userRequests), forkJoin(examRequests)]).subscribe(
          ([userData, examData]) => {
            results.forEach((result: any, index: number) => {
              result.username = userData[index]?.userName;
              result.email = userData[index]?.email;
              result.examTitle = examData[index]?.title;
            });

            this.examResults = results;
            this.filteredResults = [...this.examResults];
            this.isLoading = false;
          },
          (error) => {
            this.errorMessage = 'Error fetching data';
            this.isLoading = false;
          }
        );
      },
      (error) => {
        this.errorMessage = 'Error loading exam results';
        this.isLoading = false;
      }
    );
  }

  search(): void {
    this.filteredResults = this.examResults.filter(result =>
      result.username.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      result.email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      result.examTitle.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  sortResults(field: string): void {
    this.sortField = field;
    this.sortAscending = !this.sortAscending;
    this.filteredResults.sort((a, b) => {
      if (this.sortAscending) {
        return a[field] > b[field] ? 1 : -1;
      } else {
        return a[field] < b[field] ? 1 : -1;
      }
    });
  }

  applyPercentageFilter(): void {
    switch (this.percentageFilter) {
      case 'top20':
        this.filteredResults = this.examResults.filter(result => result.percentage >= 80);
        break;
      case 'top50':
        this.filteredResults = this.examResults.filter(result => result.percentage >= 50 );
        break;
      case 'bottom20':
        this.filteredResults = this.examResults.filter(result => result.percentage < 20);
        break;
      default:
        this.filteredResults = [...this.examResults];
    }
  }

  get paginatedResults(): any[] {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    return this.filteredResults.slice(start, end);
  }

  // Manually create a CSV string and download it
  downloadCSV(): void {
    const csvHeaders = 'UserName,Email,ExamTitle,Score,Percentage,Passed,AttemptNumber\n';
    const csvRows = this.filteredResults.map(result => {
      return `${result.username},${result.email},${result.examTitle},${result.totalScore},${result.percentage}%,${result.passed ? 'Yes' : 'No'},${result.attemptNumber}`;
    });

    const csvContent = csvHeaders + csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'filtered-results.csv');
  }
}
