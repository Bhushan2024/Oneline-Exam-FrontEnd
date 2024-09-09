import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { Router } from '@angular/router';
import { ExamService } from '../../services/exam.service';
import { Exam } from '../../Interface/exam.model';
import { NavbarComponent } from '../../shared/navbar/navbar.component';

@Component({
  selector: 'app-exam',
  standalone: true,
  imports: [CommonModule, NavbarComponent],  
  templateUrl: './exam.component.html',
  styleUrls: ['./exam.component.css']
})
export class ExamComponent implements OnInit {
  exams: Exam[] = [];
  selectedExam: Exam | null = null;

  constructor(private examService: ExamService, private router: Router) {}

  ngOnInit(): void {
    this.examService.getExams().subscribe((data: Exam[]) => {
      const currentDate = new Date();

      // Filter exams based on isPublished, and check if the current date is between start and end date
      this.exams = data.filter(exam => 
        exam.isPublished &&
        currentDate >= new Date(exam.startDate) && 
        currentDate <= new Date(exam.endDate)
      );
    });
  }

  startExam(exam: Exam): void {
    this.selectedExam = exam;
    this.router.navigate([`/exam/${this.selectedExam.examId}`]);
  }
}
