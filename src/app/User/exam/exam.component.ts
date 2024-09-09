import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Import CommonModule
import { Router } from '@angular/router';
import { ExamService } from '../../services/exam.service';
import { Exam } from '../../Interface/exam.model';
import { NavbarComponent } from '../../shared/navbar/navbar.component';

@Component({
  selector: 'app-exam',
  standalone: true,
  imports: [CommonModule, NavbarComponent],  // Add CommonModule here
  templateUrl: './exam.component.html',
  styleUrls: ['./exam.component.css']
})
export class ExamComponent implements OnInit {
  exams: Exam[] = [];
  selectedExam: Exam | null = null;  // Track which exam the user clicked "Start" on

  constructor(private examService: ExamService, private router: Router) {}

  ngOnInit(): void {
    this.examService.getExams().subscribe((data: Exam[]) => {
      this.exams = data.filter(exam => exam.isPublished); // Show only published exams
    });
  }

  // Navigate to the SectionComponent where exam sections and questions are displayed
  startExam(exam: Exam): void {
    this.selectedExam = exam;
    // Directly navigate to the section component (exam section and question page)
    this.router.navigate([`/exam/${this.selectedExam.examId}`]);
  }
}
