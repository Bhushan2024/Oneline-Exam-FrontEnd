import { Component, OnInit } from '@angular/core';
import { ReportService } from '../../services/report.service';
import { saveAs } from 'file-saver';  // To handle CSV download
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminNavbarComponent } from '../admin-navbar/admin-navbar.component';

@Component({
  selector: 'app-admin-report',
  templateUrl: './admin-report.component.html',
  styleUrls: ['./admin-report.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, AdminNavbarComponent]
})
export class AdminReportComponent implements OnInit {
  reportOptions = [
    { value: 'testsPerDay', label: 'Number of tests taken per day' },
    { value: 'finishedBeforeTime', label: 'Tests finished before time by 20%' },
    { value: 'autoSubmitted', label: 'Auto-submitted tests after 30 mins' },
    { value: 'markedForReview', label: 'Marked for review' }
  ];

  selectedReport: string = '';
  reportData: any[] = [];
  isLoading = false;
  errorMessage = '';

  constructor(private reportService: ReportService) { }

  ngOnInit(): void { }

  // Fetch report data based on selected report
  fetchReportData(): void {
    this.isLoading = true;
    this.reportData = [];
    this.errorMessage = '';

    switch (this.selectedReport) {
      case 'testsPerDay':
        this.reportService.getTestsPerDay().subscribe(
          (data) => {
            this.reportData = data || [];
            this.isLoading = false;
          },
          (error) => {
            this.errorMessage = 'Error fetching data';
            this.isLoading = false;
          }
        );
        break;
      case 'finishedBeforeTime':  // Added new report case
        this.reportService.getTestsFinishedBeforeTime().subscribe(
          (data) => {
            this.reportData = data || [];
            this.isLoading = false;
          },
          (error) => {
            this.errorMessage = 'Error fetching data';
            this.isLoading = false;
          }
        );
        break;
      case 'markedForReview':
        this.reportService.getTestsMarkedForReview().subscribe(
          (data) => {
            this.reportData = data || [];
            this.isLoading = false;
          },
          (error) => {
            this.errorMessage = 'Error fetching data';
            this.isLoading = false;
          }
        );
        break;
      case 'autoSubmitted':
        this.reportService.getAutoSubmittedAfter30Mins().subscribe(
          (data) => {
            this.reportData = data || [];
            this.isLoading = false;
          },
          (error) => {
            this.errorMessage = 'Error fetching data';
            this.isLoading = false;
          }
        );
        break;
      default:
        this.errorMessage = 'We Are working On this Report, Please Check After Some Time.';
        this.isLoading = false;
        break;
    }
  }

  // Download report data as CSV
downloadCSV(): void {
  let csvData = '';
  let headers = '';

  if (this.selectedReport === 'testsPerDay') {
    headers = 'Date,Number of Tests\n';
    csvData = this.reportData.map(row => `${row.date},${row.numberOfTests}`).join('\n');
  } 
  else if (this.selectedReport === 'finishedBeforeTime') {
    headers = 'Exam Result ID,User Name,User Email,Exam Title,Total Score,Percentage,Passed,Completed Date,Duration\n';
    csvData = this.reportData.map(row => 
      `${row.examResultId},${row.userName},${row.userEmail},${row.examTitle},${row.totalScore},${row.percentage},${row.passed ? 'Pass' : 'Fail'},${row.completedDate},${row.duration}`
    ).join('\n');
  } 
  else if (this.selectedReport === 'markedForReview') {
    headers = 'Date,Marked For Review,User Name,User Email,Exam Title,Total Score,Passed\n';
    csvData = this.reportData.map(row => 
      `${row.completedDate},${row.markforreview},${row.userName},${row.userEmail},${row.examTitle},${row.totalScore},${row.passed ? 'Pass' : 'Fail'}`
    ).join('\n');
  } 
  else if (this.selectedReport === 'autoSubmitted') {
    headers = 'Exam Result ID,User Name,User Email,Exam Title,Total Score,Percentage,Passed,Completed Date,Duration,Total Questions,Attempted Questions\n';
    csvData = this.reportData.map(row => 
      `${row.examResultId},${row.userName},${row.userEmail},${row.examTitle},${row.totalScore},${row.percentage},${row.passed ? 'Pass' : 'Fail'},${row.completedDate},${row.duration},${row.totalQuestions},${row.attemptedQuestions}`
    ).join('\n');
  }

  const blob = new Blob([headers + csvData], { type: 'text/csv' });
  saveAs(blob, `${this.selectedReport}-report.csv`);
}


}
