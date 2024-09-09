import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';  // Assuming this is your environment config

@Injectable({
  providedIn: 'root'
})
export class ExamResultService {
  private apiUrl = 'https://localhost:7205/api/ExamResult/Submit';  // URL for submitting the exam
  private resultUrl = `${environment.apiUrl}/ExamResult`;  // Base URL for fetching results

  constructor(private http: HttpClient) {}

  // Function to submit the exam
  submitExam(examData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, examData);
  }

  // Function to get results by user ID
  getResultsByUser(userId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.resultUrl}/GetResultsByUser/${userId}`);
  }

  // Fetch all results
  getAllResults(): Observable<any[]> {
    return this.http.get<any[]>(`${this.resultUrl}/GetAllResults`);  // Corrected URL
  }
}
