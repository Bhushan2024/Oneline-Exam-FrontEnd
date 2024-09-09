import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Exam } from '../Interface/exam.model';
import { CreateExamDto, UpdateExamDto } from '../Interface/exam.model';  // Assuming these interfaces exist

@Injectable({
  providedIn: 'root'
})
export class ExamService {
  private apiUrl = `${environment.apiUrl}/exam`;  // Adjust this API URL as needed

  constructor(private http: HttpClient) {}

  // Fetch all exams
  getExams(): Observable<Exam[]> {
    return this.http.get<Exam[]>(this.apiUrl);
  }

  // Fetch specific exam by ID
  getExamById(examId: number): Observable<Exam> {
    return this.http.get<Exam>(`${this.apiUrl}/${examId}`);
  }

  // Create a new exam
  createExam(examData: CreateExamDto): Observable<Exam> {
    return this.http.post<Exam>(this.apiUrl, examData);
  }

  // Update an existing exam
  updateExam(examId: number, examData: UpdateExamDto): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${examId}`, examData);
  }

  // Delete an exam
  deleteExam(examId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${examId}`);
  }
}
