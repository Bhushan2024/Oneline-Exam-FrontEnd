import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Section {
  sectionId: number;
  sectionName: string;
}

export interface OptionDto {
  optionId: number;
  optionText: string;
  isCorrect: boolean;
}

export interface QuestionDto {
  questionId: number;
  questionText: string;
  isMultipleChoice: boolean;
  options: OptionDto[];
}

@Injectable({
  providedIn: 'root',
})
export class SectionService {
  private apiUrl = `${environment.apiUrl}/Section`;  // Adjust the API URL

  constructor(private http: HttpClient) {}

  // Updated method to fetch sections by examId using the provided API
  getSectionsByExamId(examId: number): Observable<Section[]> {
    return this.http.get<Section[]>(`${this.apiUrl}/Exam/${examId}`);
  }

  // Method to fetch questions by sectionId
  getQuestionsBySectionId(sectionId: number): Observable<QuestionDto[]> {
    return this.http.get<QuestionDto[]>(`${environment.apiUrl}/Question?sectionId=${sectionId}`);
  }
}
