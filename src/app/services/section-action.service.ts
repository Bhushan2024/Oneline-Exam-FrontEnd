import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SectionPostDTO, SectionGetDTO, QuestionPostDTO } from '../Interface/exam.model';
import { environment } from '../../environments/environment'; // Make sure your environment contains the API URL

@Injectable({
  providedIn: 'root'
})
export class SectionActionService {
  private apiUrl = `${environment.apiUrl}/SectionAction`; // The base URL for section actions

  constructor(private http: HttpClient) {}

  // Get sections by ExamId
  getSectionsByExamId(examId: number): Observable<SectionGetDTO[]> {
    return this.http.get<SectionGetDTO[]>(`${this.apiUrl}/exam/${examId}`);
  }

  // Get section by SectionId
  getSectionById(sectionId: number): Observable<SectionGetDTO> {
    return this.http.get<SectionGetDTO>(`${this.apiUrl}/${sectionId}`);
  }

  // Create a new section
  createSection(sectionData: SectionPostDTO): Observable<void> {
    return this.http.post<void>(this.apiUrl, sectionData);
  }

  // Update a section by SectionId
  updateSection(sectionId: number, sectionData: SectionPostDTO): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${sectionId}`, sectionData);
  }

  // Delete a section by SectionId
  deleteSection(sectionId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${sectionId}`);
  }

  //Add a new question to a section
  addQuestion(sectionId: number, questionData: QuestionPostDTO): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${sectionId}/questions`, questionData);
  }

  // Inside SectionActionService
// addQuestion(sectionId: number, questionData: QuestionPostDTO): Observable<void> {
//   const headers = { 'Content-Type': 'application/json' };
//   return this.http.post<void>(`${this.apiUrl}/${sectionId}/questions`, questionData, { headers });
// }

// Inside SectionActionService
// addQuestion(sectionId: number, questionData: { questionDto: QuestionPostDTO }): Observable<void> {
//   return this.http.post<void>(`${this.apiUrl}/${sectionId}/questions`, questionData);
// }



  // Delete a question by QuestionId
  deleteQuestion(questionId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/questions/${questionId}`);
  }
  
  addQuestionToSection(questionData: { sectionId: number, questionText: string, isMultipleChoice: boolean, options: { optionText: string, isCorrect: boolean }[] }): Observable<void> {
    return this.http.post<void>('https://localhost:7205/api/Question', questionData);
  }
}
