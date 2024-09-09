import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SectionService } from '../../services/section.service';
import { QuestionService, Question } from '../../services/question.service';
import { ExamResultService } from '../../services/exam-result.service';
import { AuthService } from '../../services/auth.service';
import { ExamService } from '../../services/exam.service'; // Import the ExamService
import { Exam } from '../../Interface/exam.model'; // Import Exam model
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../shared/navbar/navbar.component';

@Component({
  selector: 'app-section',
  standalone: true,
  templateUrl: './section.component.html',
  styleUrls: ['./section.component.css'],
  imports: [CommonModule, FormsModule, NavbarComponent],
})
export class SectionComponent implements OnInit, OnDestroy {
  examId: number | null = null;
  userId: string | null = null; // We'll get the userId from the AuthService
  sections: any[] = [];
  questions: Question[] = [];
  filteredQuestions: Question[] = [];
  selectedSection: any | null = null;
  selectedQuestion: Question | null = null;

  // Timer related variables
  timeLeft: number = 0; // Initially set to 0, updated based on exam duration
  timerDisplay: string = '';
  timerInterval: any = null;
  totalExamTime: number = 0; // Store total exam time in seconds

  // State for tracking answers and question statuses
  answers: { [questionId: number]: number[] } = {};
  markedForReview: { [questionId: number]: boolean } = {};
  currentQuestionIndex: number = 0;

  constructor(
    private sectionService: SectionService,
    private questionService: QuestionService,
    private examResultService: ExamResultService,
    private examService: ExamService, // Use ExamService for fetching exam details
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.examId = Number(this.route.snapshot.paramMap.get('examId'));

    // Get the userId from the JWT token
    this.userId = this.authService.getUserId();

    if (this.examId) {
      this.loadSections();
      this.loadQuestions();
      this.loadExamDetails(); // Load exam details to get the duration
    }
  }

  ngOnDestroy(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
    this.removeUnloadEvent();
  }

  // Load exam details using the ExamService to set the timer duration
  loadExamDetails(): void {
    if (this.examId) {
      this.examService.getExamById(this.examId).subscribe((exam: Exam) => {
        if (exam && exam.duration) {
          this.totalExamTime = exam.duration * 60; // Convert minutes to seconds
          this.timeLeft = this.totalExamTime; // Set initial time left
          this.startTimer(); // Start the timer with the updated timeLeft
  
          // Once exam details are loaded, load sections
          this.loadSections();  
        }
      });
    }
  }
  
  loadSections(): void {
    if (this.examId) {
      this.sectionService.getSectionsByExamId(this.examId).subscribe(
        (sections: any[]) => {
          this.sections = sections;
          console.log('Sections loaded:', this.sections);
  
          // Automatically select the first section and load its questions
          if (this.sections.length > 0) {
            this.selectSection(this.sections[0]);  // Automatically select first section
          }
        },
        (error: any) => {
          console.error('Error loading sections', error);
        }
      );
    }
  }

  // Start the countdown timer
  startTimer(): void {
    this.updateTimerDisplay();
    this.timerInterval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
        this.updateTimerDisplay();
      } else {
        clearInterval(this.timerInterval);
        this.submitExam(true); // Auto-submit when time runs out with a timeout flag
      }
    }, 1000); // Update every second
  }

  // Update the timer display in "MM:SS" format
  updateTimerDisplay(): void {
    const minutes: number = Math.floor(this.timeLeft / 60);
    const seconds: number = this.timeLeft % 60;
    this.timerDisplay = `${this.padNumber(minutes)}:${this.padNumber(seconds)}`;
  }

  // Helper function to pad numbers (e.g., 5 becomes "05")
  padNumber(num: number): string {
    return num < 10 ? `0${num}` : num.toString();
  }

  // Submit the exam when time runs out or when user manually submits
  submitExam(isTimeout: boolean = false): void {
    const confirmation = isTimeout || confirm('Do you want to submit the exam?');
    if (confirmation) {
      const examData = this.prepareExamSubmissionData();
      console.log('Submitting exam data:', examData);

      // Call the service to submit the exam
      this.examResultService.submitExam(examData).subscribe(
        (response) => {
          console.log('API Response:', response); // Ensure response is logged

          // Store the API response in local storage
          localStorage.setItem('examResult', JSON.stringify(response));

          // Redirect to the exam result page after submission
          this.router.navigate(['/exam-result']); // Redirect to exam result page

          if (isTimeout) {
            alert('Time is up! The exam was automatically submitted.');
          }
        },
        (error) => {
          console.error('Error submitting exam:', error);
        }
      );
    }
  }

  // Prepare the data in the required format for submission
  prepareExamSubmissionData(): any {
    const userAnswers = Object.keys(this.answers).map((questionId) => {
      return {
        questionId: Number(questionId),
        selectedOptionId: this.answers[Number(questionId)][0], // Assuming single answer for now
      };
    });

    const markforreview = Object.keys(this.markedForReview).length;

    // Calculate the duration as the total exam time minus the current remaining time
    const durationSpent = Math.floor((this.totalExamTime - this.timeLeft) / 60);

    return {
      examId: this.examId,
      userId: this.userId, // Get the userId from the decoded JWT token
      duration: durationSpent, // Time spent in minutes
      markforreview: markforreview,
      userAnswers: userAnswers,
    };
  }

  loadQuestions(): void {
    this.questionService.getAllQuestions().subscribe(
      (questions: Question[]) => {
        this.questions = questions;
        console.log('All questions loaded:', this.questions);
      },
      (error: any) => {
        console.error('Error loading questions', error);
      }
    );
  }

  // Filter questions by sectionId
  selectSection(section: any): void {
    this.selectedSection = section;
    this.filteredQuestions = this.questions.filter(
      (q) => q.sectionId === section.sectionId
    );
    this.currentQuestionIndex = 0;
    this.selectedQuestion = this.filteredQuestions[this.currentQuestionIndex];
  }

  // Save selected answers
  selectAnswer(optionId: number): void {
    if (!this.answers[this.selectedQuestion!.questionId]) {
      this.answers[this.selectedQuestion!.questionId] = [];
    }

    const index = this.answers[this.selectedQuestion!.questionId].indexOf(optionId);
    if (index === -1) {
      this.answers[this.selectedQuestion!.questionId].push(optionId); // Add answer
    } else {
      this.answers[this.selectedQuestion!.questionId].splice(index, 1); // Deselect
    }
  }

  isSelected(optionId: number): boolean {
    return this.answers[this.selectedQuestion!.questionId]?.includes(optionId);
  }

  markForReview(): void {
    this.markedForReview[this.selectedQuestion!.questionId] = true;
  }

  isMarkedForReview(questionId: number): boolean {
    return this.markedForReview[questionId] || false;
  }

  nextQuestion(): void {
    if (this.currentQuestionIndex < this.filteredQuestions.length - 1) {
      this.currentQuestionIndex++;
      this.selectedQuestion = this.filteredQuestions[this.currentQuestionIndex];
    }
  }

  prevQuestion(): void {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
      this.selectedQuestion = this.filteredQuestions[this.currentQuestionIndex];
    }
  }

  getQuestionStatusColor(question: Question): string {
    if (this.selectedQuestion?.questionId === question.questionId) {
      return 'btn-primary';
    } else if (this.answers[question.questionId]?.length > 0) {
      return 'btn-success';
    } else if (this.isMarkedForReview(question.questionId)) {
      return 'btn-warning';
    } else {
      return 'btn-outline-secondary';
    }
  }

  // Prevent page reload or navigation away
  @HostListener('window:beforeunload', ['$event'])
  handleBeforeUnload(event: BeforeUnloadEvent): void {
    event.preventDefault(); // This is required for the event to work in most browsers
    event.returnValue = ''; // Most browsers require setting `returnValue` to show the prompt
  }

  // Remove the event listener for beforeunload when the component is destroyed
  removeUnloadEvent(): void {
    window.removeEventListener('beforeunload', this.handleBeforeUnload);
  }
}
