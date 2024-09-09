import { CommonModule } from '@angular/common';
import { Component, OnInit, HostListener } from '@angular/core';
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

    // Add a state to prevent back button navigation
    history.pushState(null, '', location.href);
    window.addEventListener('popstate', this.handleBackButton.bind(this));
  }

  // Method to clear localStorage and redirect to user dashboard
  exit(): void {
    this.clearDataAndRedirect();
  }

  // Handle the back button (browser back button)
  handleBackButton(event: any): void {
    this.clearDataAndRedirect();
  }

  // Method to clear data and redirect to user dashboard
  clearDataAndRedirect(): void {
    localStorage.clear();  // Clear the localStorage
    this.router.navigate(['/user-dashboard']);  // Redirect to user dashboard
  }

  // Clean up the event listener when the component is destroyed
  ngOnDestroy(): void {
    window.removeEventListener('popstate', this.handleBackButton.bind(this));
  }
}
