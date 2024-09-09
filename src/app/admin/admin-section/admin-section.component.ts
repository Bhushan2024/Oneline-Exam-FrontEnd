import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SectionActionService } from '../../services/section-action.service';
import { ExamService } from '../../services/exam.service';
import { SectionPostDTO, SectionGetDTO, QuestionPostDTO, OptionPostDTO, OptionGetDTO, Exam } from '../../Interface/exam.model';
import { CommonModule } from '@angular/common';
import { AdminNavbarComponent } from '../admin-navbar/admin-navbar.component';

@Component({
  selector: 'app-admin-section',
  templateUrl: './admin-section.component.html',
  styleUrls: ['./admin-section.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule, AdminNavbarComponent]  // Import necessary modules
})
export class AdminSectionComponent implements OnInit {
  examForm!: FormGroup;
  selectedExamId: number | null = null;
  sections: SectionGetDTO[] = [];
  exams: Exam[] = [];
  sectionForm!: FormGroup;
  editSectionForm!: FormGroup;  // Form for editing a section
  questionForm!: FormGroup;
  optionForm!: FormGroup;
  newQuestionOptions: OptionPostDTO[] = [];  // Store options for the new question being added
  expandedSections: Set<number> = new Set<number>();  // Track expanded sections
  expandedQuestions: Set<number> = new Set<number>(); // Track expanded questions
  selectedSectionForEdit: SectionGetDTO | null = null; // Track the selected section for editing
  isEditMode = false;  // Control for showing the edit section popup
  mediaUrl = '';

  constructor(
    private fb: FormBuilder,
    private sectionService: SectionActionService,
    private examService: ExamService
  ) { }

  ngOnInit(): void {
    this.initializeForms();
    this.loadExams();
  }

  // Initialize the form structures
  initializeForms(): void {
    this.sectionForm = this.fb.group({
      title: ['', Validators.required],
      numberOfQuestions: [0, [Validators.required, Validators.min(1)]],
      totalMarks: [0, Validators.required],
      passingMarks: [0, Validators.required],
      weightage: [null, [Validators.required, Validators.min(1), Validators.max(100)]]  // Add this field
    });

    this.sectionForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      numberOfQuestions: [0, [Validators.required, Validators.min(1)]],
      totalMarks: [0, Validators.required],
      passingMarks: [0, Validators.required],
      weightage: [null, [Validators.required, Validators.min(1), Validators.max(100)]]
    }, { validators: this.validateMarks }); // Apply custom validator for marks
    
    this.editSectionForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      numberOfQuestions: [, [Validators.required, Validators.min(1)]],
      totalMarks: [, Validators.required],
      passingMarks: [, Validators.required],
      weightage: [null, [Validators.required, Validators.min(1), Validators.max(100)]]
    }, { validators: this.validateMarks }); // Apply custom validator for marks
    

    this.questionForm = this.fb.group({
      questionText: ['', Validators.required],
      isMultipleChoice: [false, Validators.required],
      includeMedia: ['0'], // Default to 'No' for including media
      mediaType: [''], // Media type (Image/Video)
      mediaUrl: ['']   // Media URL      
    });

    this.optionForm = this.fb.group({
      optionText: ['', Validators.required],
      isCorrect: [false],
      marks: []  // Add marks field with validation
    });
  }

  // Custom validator function for passing marks vs total marks
validateMarks(formGroup: FormGroup): { [key: string]: any } | null {
  const totalMarks = formGroup.get('totalMarks')?.value;
  const passingMarks = formGroup.get('passingMarks')?.value;

  return totalMarks >= passingMarks ? null : { 'invalidMarks': true }; // Return error if invalid
}

  // Load exams from the service
  loadExams(): void {
    this.examService.getExams().subscribe((data: Exam[]) => {
      this.exams = data;
    });
  }
  examFormControl = this.fb.control('', Validators.required);  // FormControl for the exam selection


  // On selecting an exam, load the sections
  onSelectExam(event: Event): void {
    const examId = (event.target as HTMLSelectElement).value;
    if (examId) {
      this.selectedExamId = +examId;
      this.loadSections(this.selectedExamId);
    }
  }

  // Load sections for the selected exam
  loadSections(examId: number): void {
    this.sectionService.getSectionsByExamId(examId).subscribe((sections: SectionGetDTO[]) => {
      this.sections = sections;
      console.log('Sections loaded for exam:', examId, sections);
    });
  }

  // Add a new section
  addSection(): void {
    if (this.sectionForm.invalid || !this.selectedExamId) {
      return;
    }

    const newSection: SectionPostDTO = {
      examId: this.selectedExamId!,
      title: this.sectionForm.value.title,
      numberOfQuestions: this.sectionForm.value.numberOfQuestions,
      totalMarks: this.sectionForm.value.totalMarks,
      passingMarks: this.sectionForm.value.passingMarks,
      questions: [],
      weightage: this.sectionForm.value.weightage / 100,
    };

    this.sectionService.createSection(newSection).subscribe(() => {
      this.loadSections(this.selectedExamId!);
      this.sectionForm.reset();
      console.log('New section added:', newSection);
    });
  }

  // Function to add a new option
  addOption(): void {
    if (this.optionForm.invalid) {
      return;
    }

    const newOption: OptionPostDTO = {
      optionText: this.optionForm.value.optionText,
      isCorrect: this.optionForm.value.isCorrect || false,
      marks: this.optionForm.value.marks  // Add the marks value from form
    };

    this.newQuestionOptions.push(newOption);  // Add the option to the new question
    this.optionForm.reset();
    console.log('Option added:', newOption);

    // Check if more than one correct option is selected and set isMultipleChoice accordingly
    const correctOptionsCount = this.newQuestionOptions.filter(option => option.isCorrect).length;
    this.questionForm.patchValue({
      isMultipleChoice: correctOptionsCount > 1  // Set true if more than one correct option
    });
  }

  // Function to save the question
  saveQuestion(section: SectionGetDTO): void {
    if (this.questionForm.invalid || this.newQuestionOptions.length === 0) {
      return;  // Ensure all question data is entered
    }

    const newQuestion: QuestionPostDTO = {
      questionText: this.questionForm.value.questionText,
      isMultipleChoice: this.questionForm.value.isMultipleChoice, // Send isMultipleChoice flag
      createdDate: new Date(),
      options: this.newQuestionOptions.map(option => ({
        optionText: option.optionText,
        isCorrect: option.isCorrect,
        marks: option.marks
      })),
      // Convert mediaType to a number before sending
      mediaType: this.questionForm.get('includeMedia')?.value === '1' ? parseInt(this.questionForm.value.mediaType, 10) : 0,
      mediaUrl: this.questionForm.get('includeMedia')?.value === '1' ? this.questionForm.value.mediaUrl : '',
    };

    console.log('Question Data to be sent:', newQuestion);

    this.sectionService.addQuestion(section.sectionId, newQuestion).subscribe({
      next: () => {
        section.questions.push({
          ...newQuestion,
          questionId: Math.random(),  // Temporary client-side ID
          options: newQuestion.options.map((option, index) => ({
            optionId: index + 1,  // Temporary ID for frontend display
            ...option
          }))
        });
        console.log('Question added successfully');
        this.resetQuestionForm();  // Reset the form and option list
      },
      error: (err) => {
        console.error('Error adding question:', err);
      }
    });
  }


  // Open the edit popup with pre-filled section data
  openEditPopup(section: SectionGetDTO): void {
    this.isEditMode = true;
    this.selectedSectionForEdit = section;

    this.editSectionForm.patchValue({
      title: section.title,
      numberOfQuestions: section.numberOfQuestions,
      totalMarks: section.totalMarks,
      passingMarks: section.passingMarks,
      weightage: section.weightage * 100
    });
  }

  // Close the edit popup
  closeEditPopup(): void {
    this.isEditMode = false;
    this.selectedSectionForEdit = null;
    this.editSectionForm.reset();
  }

  // Save the edited section
  saveEditedSection(): void {
    if (this.editSectionForm.invalid || !this.selectedSectionForEdit) {
      return;
    }

    const updatedSection: SectionPostDTO = {
      examId: this.selectedSectionForEdit.examId,
      title: this.editSectionForm.value.title,
      numberOfQuestions: this.editSectionForm.value.numberOfQuestions,
      totalMarks: this.editSectionForm.value.totalMarks,
      passingMarks: this.editSectionForm.value.passingMarks,
      questions: [], // Always send an empty array for questions,
      weightage: this.editSectionForm.value.weightage / 100
    };

    console.log('Edited Section Data:', updatedSection);

    this.sectionService.updateSection(this.selectedSectionForEdit.sectionId, updatedSection).subscribe({
      next: () => {
        console.log('Section updated successfully');
        this.loadSections(this.selectedExamId!);
        this.closeEditPopup();
      },
      error: (err) => {
        console.error('Error updating section:', err);
      }
    });
  }




  // Remove an option from the new question (before saving)
  removeNewOption(optionText: string): void {
    this.newQuestionOptions = this.newQuestionOptions.filter(option => option.optionText !== optionText);
    console.log('Option removed:', optionText);
  }

  // Remove a section and call the API
  // Remove a section and call the API after confirmation
  removeSection(sectionId: number): void {
    const confirmation = window.confirm('Are you sure you want to delete this section?');

    if (confirmation) {
      this.sectionService.deleteSection(sectionId).subscribe({
        next: () => {
          this.sections = this.sections.filter(section => section.sectionId !== sectionId);
          console.log('Section removed with ID:', sectionId);
        },
        error: (err) => {
          console.error('Error removing section:', err);
        }
      });
    }
  }


  // Remove a saved question from the section
  removeQuestion(section: SectionGetDTO, questionId: number): void {
    this.sectionService.deleteQuestion(questionId).subscribe({
      next: () => {
        section.questions = section.questions.filter(question => question.questionId !== questionId);
        console.log('Question removed with ID:', questionId);
      },
      error: (err) => {
        console.error('Error removing question:', err);
      }
    });
  }

  // Toggle section expansion
  toggleSection(sectionId: number): void {
    if (this.expandedSections.has(sectionId)) {
      this.expandedSections.delete(sectionId);
    } else {
      this.expandedSections.add(sectionId);
    }
    console.log('Toggled section expansion for section ID:', sectionId);
  }

  // Toggle question expansion
  toggleQuestion(questionId: number): void {
    if (this.expandedQuestions.has(questionId)) {
      this.expandedQuestions.delete(questionId);
    } else {
      this.expandedQuestions.add(questionId);
    }
    console.log('Toggled question expansion for question ID:', questionId);
  }

  // Check if a section is expanded
  isSectionExpanded(sectionId: number): boolean {
    return this.expandedSections.has(sectionId);
  }

  // Check if a question is expanded
  isQuestionExpanded(questionId: number): boolean {
    return this.expandedQuestions.has(questionId);
  }

  // Reset question form and options list
  resetQuestionForm(): void {
    this.questionForm.reset();
    this.newQuestionOptions = [];
  }


}
