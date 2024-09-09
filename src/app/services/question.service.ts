import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';  // Adjust this path if necessary

export interface Option {
  optionId: number;
  optionText: string;
  isCorrect: boolean;
}

export interface Question {
  questionId: number;
  sectionId: number;
  questionText: string;
  isMultipleChoice: boolean;
  options: Option[];
  mediaType: number;
  mediaUrl: string;
}

@Injectable({
  providedIn: 'root',
})
export class QuestionService {
  private apiUrl = `${environment.apiUrl}/Question`;  // Update with your actual API endpoint

  constructor(private http: HttpClient) {}

  // Method to fetch all questions
  getAllQuestions(): Observable<Question[]> {
    return this.http.get<Question[]>(this.apiUrl);  // Make sure this points to the correct API
  }
}
