import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ExamService } from '../../services/exam.service';
import { CreateExamDto, UpdateExamDto, Exam } from '../../Interface/exam.model';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { AdminNavbarComponent } from '../admin-navbar/admin-navbar.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-exam',
  templateUrl: './admin-exam.component.html',
  styleUrls: ['./admin-exam.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, AdminNavbarComponent, RouterLink]
})
export class AdminExamComponent implements OnInit {
  examForm!: FormGroup;
  editMode = false;
  selectedExam: Exam | null = null;
  exams: Exam[] = [];
  showModal = false;
  createdByUserId: string = '';

  constructor(private fb: FormBuilder, private examService: ExamService, private authService: AuthService) {}

  ngOnInit(): void {
    this.initializeForm();
    this.getAllExams();
    this.createdByUserId = this.authService.getUserId() || '';  // Ensure it's a string
  }

  initializeForm(): void {
    this.examForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      duration: [0, [Validators.required, Validators.min(1)]],
      totalMarks: [0, Validators.required],
      passingMarks: [0, Validators.required],
      isRandmized: [false],
      createdByUserId: [''],
      isPublished: [false],
      createdDate: ['']
    });
  }

  // Fetch all exams
  getAllExams(): void {
    this.examService.getExams().subscribe((data: Exam[]) => {
      this.exams = data;
    });
  }

  // Open modal for creating or editing exams
  openModal(exam?: Exam): void {
    this.showModal = true;
    if (exam) {
      this.editMode = true;
      this.selectedExam = exam;
      this.examForm.patchValue({
        title: exam.title,
        description: exam.description,
        startDate: exam.startDate,
        endDate: exam.endDate,
        duration: exam.duration,
        totalMarks: exam.totalMarks,
        passingMarks: exam.passingMarks,
        isRandmized: exam.isRandmized,
        createdByUserId: exam.createdByUserId,
        isPublished: exam.isPublished,
        createdDate: exam.createdDate
      });
    } else {
      this.editMode = false;
      this.examForm.reset();
    }
  }

  // Close modal
  closeModal(): void {
    this.showModal = false;
    this.resetForm();
  }

  // Submit form for creating or updating exam
  onSubmit(): void {
    if (this.examForm.invalid) {
      return;
    }

    if (this.editMode && this.selectedExam) {
      const updateExamDto: UpdateExamDto = {
        title: this.examForm.value.title,
        description: this.examForm.value.description,
        startDate: this.examForm.value.startDate,
        endDate: this.examForm.value.endDate,
        isPublished: this.examForm.value.isPublished,
        duration: this.examForm.value.duration,
        totalMarks: this.examForm.value.totalMarks,
        passingMarks: this.examForm.value.passingMarks,
        isRandmized: this.examForm.value.isRandmized,
        createdByUserId: this.examForm.value.createdByUserId,
        createdDate: this.examForm.value.createdDate
      };
      console.log('Update Exam Data:', updateExamDto);  // Log data before posting
      this.examService.updateExam(this.selectedExam.examId, updateExamDto).subscribe(() => {
        this.getAllExams();
        this.closeModal();
      });
    } else {
      const createExamDto: CreateExamDto = {
        title: this.examForm.value.title,
        description: this.examForm.value.description,
        startDate: this.examForm.value.startDate,
        endDate: this.examForm.value.endDate,
        duration: this.examForm.value.duration,
        totalMarks: this.examForm.value.totalMarks,
        passingMarks: this.examForm.value.passingMarks,
        createdByUserId: this.createdByUserId,
        isRandmized: this.examForm.value.isRandmized
      };
      console.log('Create Exam Data:', createExamDto);  // Log data before posting
      this.examService.createExam(createExamDto).subscribe(() => {
        this.getAllExams();
        this.closeModal();
      });
    }
  }

  // Update `isPublished` status
  togglePublishedStatus(exam: Exam): void {
    const updateExamDto: UpdateExamDto = {
      title: exam.title,
      description: exam.description,
      startDate: exam.startDate,
      endDate: exam.endDate,
      isPublished: !exam.isPublished,  // Toggle the published status
      duration: exam.duration,
      totalMarks: exam.totalMarks,
      passingMarks: exam.passingMarks,
      isRandmized: exam.isRandmized,
      createdByUserId: exam.createdByUserId,
      createdDate: exam.createdDate
    };
    console.log('Update Published Status:', updateExamDto);  // Log the updated data
    this.examService.updateExam(exam.examId, updateExamDto).subscribe(() => {
      this.getAllExams();
    });
  }

  // Update `isRandmized` status
  toggleRandomizedStatus(exam: Exam): void {
    const updateExamDto: UpdateExamDto = {
      title: exam.title,
      description: exam.description,
      startDate: exam.startDate,
      endDate: exam.endDate,
      isPublished: exam.isPublished,
      duration: exam.duration,
      totalMarks: exam.totalMarks,
      passingMarks: exam.passingMarks,
      isRandmized: !exam.isRandmized,  // Toggle the randomized status
      createdByUserId: exam.createdByUserId,
      createdDate: exam.createdDate
    };
    console.log('Update Randomized Status:', updateExamDto);  // Log the updated data
    this.examService.updateExam(exam.examId, updateExamDto).subscribe(() => {
      this.getAllExams();
    });
  }

  resetForm(): void {
    this.examForm.reset();
    this.editMode = false;
    this.selectedExam = null;
  }
}
