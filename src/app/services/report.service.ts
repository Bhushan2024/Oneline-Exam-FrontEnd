import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';  // Adjust according to your environment configuration

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private baseUrl = `${environment.apiUrl}/Reports`;  // Base URL for the Reports API

  constructor(private http: HttpClient) {}

  // 1. Get number of tests taken per day
  getTestsPerDay(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/TestsPerDay`);
  }

  // 2. Get tests finished before 20% of the time
  getTestsFinishedBeforeTime(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/FinishedBeforeTime`);
  }

  // 3. Get auto-submitted tests after 30 minutes and less than 50% of questions attempted
  getAutoSubmittedAfter30Mins(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/AutoSubmittedAfter30Mins`);
  }

  // 4. Get tests where 50% or more questions were marked for review
  getTestsMarkedForReview(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/MarkedForReview`);
  }
}
