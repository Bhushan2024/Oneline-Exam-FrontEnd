import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class ResultComponent implements OnInit {
  examResult: any = null;  // Holds the exam result data
  passed: boolean = false; // Holds the overall result pass/fail status

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Fetch the exam result from localStorage
    const resultData = localStorage.getItem('examResult');
    if (resultData) {
      this.examResult = JSON.parse(resultData);
      this.passed = this.examResult.passed; // Assuming 'passed' is part of the response
    }
  }

  // Method to exit and clear localStorage
  exit(): void {
    localStorage.clear();  // Clear the localStorage
    this.router.navigate(['/user-dashboard']);  // Redirect to user dashboard
  }
}
