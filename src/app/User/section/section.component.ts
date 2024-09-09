

// import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
// import { ActivatedRoute, Router } from '@angular/router';
// import { SectionService } from '../../services/section.service';
// import { QuestionService, Question } from '../../services/question.service';
// import { ExamResultService } from '../../services/exam-result.service';
// import { AuthService } from '../../services/auth.service';
// import { ExamService } from '../../services/exam.service'; // Import the ExamService
// import { Exam } from '../../Interface/exam.model'; // Import Exam model
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { NavbarComponent } from '../../shared/navbar/navbar.component';
// import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

// @Component({
//   selector: 'app-section',
//   standalone: true,
//   templateUrl: './section.component.html',
//   styleUrls: ['./section.component.css'],
//   imports: [CommonModule, FormsModule, NavbarComponent],
// })
// export class SectionComponent implements OnInit, OnDestroy {
//   examId: number | null = null;
//   userId: string | null = null;
//   sections: any[] = [];
//   allQuestions: Question[] = []; // Store all questions fetched from the service
//   filteredQuestions: Question[] = [];
//   selectedSection: any | null = null;
//   selectedQuestion: Question | null = null;

//   mediaType: number = 0;
//   mediaURL: string = '';

//   // Timer related variables
//   timeLeft: number = 0;
//   timerDisplay: string = '';
//   timerInterval: any = null;
//   totalExamTime: number = 0;

//   // State for tracking answers and question statuses
//   answers: { [questionId: number]: number[] } = {};
//   markedForReview: { [questionId: number]: boolean } = {};
//   currentQuestionIndex: number = 0;

//   constructor(
//     private sectionService: SectionService,
//     private questionService: QuestionService,
//     private examResultService: ExamResultService,
//     private examService: ExamService,
//     private authService: AuthService,
//     private route: ActivatedRoute,
//     private router: Router,
//     private sanitizer: DomSanitizer
//   ) {}

//   ngOnInit(): void {
//     this.examId = Number(this.route.snapshot.paramMap.get('examId'));
//     this.userId = this.authService.getUserId();

//     if (this.examId) {
//       this.loadExamDetails();
//       this.loadAllQuestions(); // Load all questions at once
//     }
//   }

//   ngOnDestroy(): void {
//     if (this.timerInterval) {
//       clearInterval(this.timerInterval);
//     }
//     this.removeUnloadEvent();
//   }

//   getVideoIframeUrl(mediaUrl: string | null): SafeResourceUrl | null {
//     if (!mediaUrl) return null;
  
//     if (mediaUrl.includes('drive.google.com')) {
//       const fileId = mediaUrl.split('/d/')[1]?.split('/')[0];
//       const embedUrl = `https://drive.google.com/file/d/${fileId}/preview`;
//       return this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
//     }
  
//     return this.sanitizer.bypassSecurityTrustResourceUrl(mediaUrl);
//   }

//   loadExamDetails(): void {
//     if (this.examId) {
//       this.examService.getExamById(this.examId).subscribe((exam: Exam) => {
//         if (exam && exam.duration) {
//           this.totalExamTime = exam.duration * 60;
//           this.timeLeft = this.totalExamTime;
//           this.startTimer();
//           this.loadSections();  
//         }
//       });
//     }
//   }

//   loadSections(): void {
//     if (this.examId) {
//       this.sectionService.getSectionsByExamId(this.examId).subscribe(
//         (sections: any[]) => {
//           this.sections = sections;
//           console.log('Sections loaded:', this.sections);

//           if (this.sections.length > 0) {
//             this.selectSection(this.sections[0]); 
//           }
//         },
//         (error: any) => {
//           console.error('Error loading sections', error);
//         }
//       );
//     }
//   }

//   // Load all questions and store them
//   loadAllQuestions(): void {
//     this.questionService.getAllQuestions().subscribe(
//       (questions: Question[]) => {
//         this.allQuestions = questions;
//         console.log('All questions loaded:', this.allQuestions);
//       },
//       (error: any) => {
//         console.error('Error loading questions', error);
//       }
//     );
//   }

//   // Select a section, randomize and limit questions based on section
//   selectSection(section: any): void {
//     this.selectedSection = section;

//     // Filter and randomize questions for the selected section
//     const sectionQuestions = this.allQuestions.filter(
//       (q) => q.sectionId === section.sectionId
//     );

//     this.filteredQuestions = this.randomizeAndLimitQuestions(sectionQuestions, section.numberOfQuestions);

//     this.currentQuestionIndex = 0;
//     this.selectedQuestion = this.filteredQuestions[this.currentQuestionIndex];
//   }

//   // Randomize and limit questions to the number of questions defined in the section
//   randomizeAndLimitQuestions(questions: Question[], limit: number): Question[] {
//     const shuffled = [...questions].sort(() => 0.5 - Math.random());
//     return shuffled.slice(0, limit);
//   }

//   startTimer(): void {
//     this.updateTimerDisplay();
//     this.timerInterval = setInterval(() => {
//       if (this.timeLeft > 0) {
//         this.timeLeft--;
//         this.updateTimerDisplay();
//       } else {
//         clearInterval(this.timerInterval);
//         this.submitExam(true);
//       }
//     }, 1000);
//   }

//   updateTimerDisplay(): void {
//     const minutes: number = Math.floor(this.timeLeft / 60);
//     const seconds: number = this.timeLeft % 60;
//     this.timerDisplay = `${this.padNumber(minutes)}:${this.padNumber(seconds)}`;
//   }

//   padNumber(num: number): string {
//     return num < 10 ? `0${num}` : num.toString();
//   }

//   submitExam(isTimeout: boolean = false): void {
//     const confirmation = isTimeout || confirm('Do you want to submit the exam?');
//     if (confirmation) {
//       const examData = this.prepareExamSubmissionData();
//       console.log('Submitting exam data:', examData);

//       this.examResultService.submitExam(examData).subscribe(
//         (response) => {
//           console.log('API Response:', response);
//           localStorage.setItem('examResult', JSON.stringify(response));
//           this.router.navigate(['/result']);

//           if (isTimeout) {
//             alert('Time is up! The exam was automatically submitted.');
//           }
//         },
//         (error) => {
//           console.error('Error submitting exam:', error);
//         }
//       );
//     }
//   }

//   prepareExamSubmissionData(): any {
//     const userAnswers = Object.keys(this.answers).map((questionId) => {
//       return {
//         questionId: Number(questionId),
//         selectedOptionIds: Array.isArray(this.answers[Number(questionId)])
//           ? this.answers[Number(questionId)]
//           : [this.answers[Number(questionId)]],
//       };
//     });

//     const markforreview = Object.keys(this.markedForReview).length;

//     const durationSpent = Math.floor((this.totalExamTime - this.timeLeft) / 60);
//     console.log(durationSpent)
//     console.log(typeof durationSpent)

//     return {
//       examId: this.examId,
//       userId: this.userId,
//       duration: durationSpent,
//       markforreview: markforreview,
//       userAnswers: userAnswers,
//     };
//   }

//   selectAnswer(optionId: number): void {
//     if (!this.answers[this.selectedQuestion!.questionId]) {
//       this.answers[this.selectedQuestion!.questionId] = [];
//     }

//     const index = this.answers[this.selectedQuestion!.questionId].indexOf(optionId);
//     if (index === -1) {
//       this.answers[this.selectedQuestion!.questionId].push(optionId);
//     } else {
//       this.answers[this.selectedQuestion!.questionId].splice(index, 1);
//     }
//   }

//   isSelected(optionId: number): boolean {
//     return this.answers[this.selectedQuestion!.questionId]?.includes(optionId);
//   }

//   markForReview(): void {
//     this.markedForReview[this.selectedQuestion!.questionId] = true;
//   }

//   isMarkedForReview(questionId: number): boolean {
//     return this.markedForReview[questionId] || false;
//   }

//   nextQuestion(): void {
//     if (this.currentQuestionIndex < this.filteredQuestions.length - 1) {
//       this.currentQuestionIndex++;
//       this.selectedQuestion = this.filteredQuestions[this.currentQuestionIndex];
//     }
//   }

//   prevQuestion(): void {
//     if (this.currentQuestionIndex > 0) {
//       this.currentQuestionIndex--;
//       this.selectedQuestion = this.filteredQuestions[this.currentQuestionIndex];
//     }
//   }

//   getQuestionStatusColor(question: Question): string {
//     if (this.selectedQuestion?.questionId === question.questionId) {
//       return 'btn-primary';
//     } else if (this.answers[question.questionId]?.length > 0) {
//       return 'btn-success';
//     } else if (this.isMarkedForReview(question.questionId)) {
//       return 'btn-warning';
//     } else {
//       return 'btn-outline-secondary';
//     }
//   }

//   @HostListener('window:beforeunload', ['$event'])
//   handleBeforeUnload(event: BeforeUnloadEvent): void {
//     event.preventDefault();
//     event.returnValue = '';
//   }

//   removeUnloadEvent(): void {
//     window.removeEventListener('beforeunload', this.handleBeforeUnload);
//   }
// }

























// import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
// import { ActivatedRoute, Router } from '@angular/router';
// import { SectionService } from '../../services/section.service';
// import { QuestionService, Question } from '../../services/question.service';
// import { ExamResultService } from '../../services/exam-result.service';
// import { AuthService } from '../../services/auth.service';
// import { ExamService } from '../../services/exam.service';
// import { Exam } from '../../Interface/exam.model';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { NavbarComponent } from '../../shared/navbar/navbar.component';
// import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

// @Component({
//   selector: 'app-section',
//   standalone: true,
//   templateUrl: './section.component.html',
//   styleUrls: ['./section.component.css'],
//   imports: [CommonModule, FormsModule, NavbarComponent],
// })
// export class SectionComponent implements OnInit, OnDestroy {
//   examId: number | null = null;
//   userId: string | null = null;
//   sections: any[] = [];
//   allQuestions: Question[] = [];
//   filteredQuestions: Question[] = [];
//   selectedSection: any | null = null;
//   selectedQuestion: Question | null = null;

//   mediaType: number = 0;
//   mediaURL: string = '';

//   // Timer related variables
//   timeLeft: number = 0;
//   timerDisplay: string = '';
//   timerInterval: any = null;
//   totalExamTime: number = 0;

//   // State for tracking answers and question statuses
//   answers: { [questionId: number]: number[] } = {};
//   markedForReview: { [questionId: number]: boolean } = {};
//   currentQuestionIndex: number = 0;

//   constructor(
//     private sectionService: SectionService,
//     private questionService: QuestionService,
//     private examResultService: ExamResultService,
//     private examService: ExamService,
//     private authService: AuthService,
//     private route: ActivatedRoute,
//     private router: Router,
//     private sanitizer: DomSanitizer
//   ) {}

//   ngOnInit(): void {
//     this.examId = Number(this.route.snapshot.paramMap.get('examId'));
//     this.userId = this.authService.getUserId();

//     if (this.examId) {
//       this.loadExamDetails();
//       this.loadAllQuestions(); // Load all questions at once
//     }
//   }

//   ngOnDestroy(): void {
//     if (this.timerInterval) {
//       clearInterval(this.timerInterval);
//     }
//     this.removeUnloadEvent();
//   }

//   getVideoIframeUrl(mediaUrl: string | null): SafeResourceUrl | null {
//     if (!mediaUrl) return null;

//     if (mediaUrl.includes('drive.google.com')) {
//       const fileId = mediaUrl.split('/d/')[1]?.split('/')[0];
//       const embedUrl = `https://drive.google.com/file/d/${fileId}/preview`;
//       return this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
//     }

//     return this.sanitizer.bypassSecurityTrustResourceUrl(mediaUrl);
//   }

//   loadExamDetails(): void {
//     if (this.examId) {
//       this.examService.getExamById(this.examId).subscribe((exam: Exam) => {
//         if (exam && exam.duration) {
//           this.totalExamTime = exam.duration * 60; // Convert minutes to seconds
//           this.timeLeft = this.totalExamTime; // Set initial time left
//           this.startTimer(); // Start the timer with the updated timeLeft
//           this.loadSections(); // Load sections once exam details are loaded
//         }
//       });
//     }
//   }

//   loadSections(): void {
//     if (this.examId) {
//       this.sectionService.getSectionsByExamId(this.examId).subscribe(
//         (sections: any[]) => {
//           this.sections = sections;
//           console.log('Sections loaded:', this.sections);

//           if (this.sections.length > 0) {
//             this.selectSection(this.sections[0]);  // Automatically select first section
//           }
//         },
//         (error: any) => {
//           console.error('Error loading sections', error);
//         }
//       );
//     }
//   }

//   loadAllQuestions(): void {
//     this.questionService.getAllQuestions().subscribe(
//       (questions: Question[]) => {
//         this.allQuestions = questions;
//         console.log('All questions loaded:', this.allQuestions);
//       },
//       (error: any) => {
//         console.error('Error loading questions', error);
//       }
//     );
//   }

//   selectSection(section: any): void {
//     this.selectedSection = section;

//     // Filter questions by section and randomize them with their options
//     const sectionQuestions = this.allQuestions.filter(
//       (q) => q.sectionId === section.sectionId
//     );

//     this.filteredQuestions = this.randomizeAndLimitQuestions(sectionQuestions, section.numberOfQuestions);

//     this.currentQuestionIndex = 0;
//     this.selectedQuestion = this.filteredQuestions[this.currentQuestionIndex];
//   }

//   // Randomize questions and their options, then limit the number of questions
//   randomizeAndLimitQuestions(questions: Question[], limit: number): Question[] {
//     const shuffledQuestions = [...questions].sort(() => 0.5 - Math.random());

//     // Shuffle the options inside each question to ensure options match the randomized questions
//     shuffledQuestions.forEach(question => {
//       question.options = question.options.sort(() => 0.5 - Math.random());
//     });

//     return shuffledQuestions.slice(0, limit); // Limit the questions based on section's numberOfQuestions
//   }

//   startTimer(): void {
//     this.updateTimerDisplay();
//     this.timerInterval = setInterval(() => {
//       if (this.timeLeft > 0) {
//         this.timeLeft--;
//         this.updateTimerDisplay();
//       } else {
//         clearInterval(this.timerInterval);
//         this.submitExam(true); // Auto-submit when time runs out
//       }
//     }, 1000);
//   }

//   updateTimerDisplay(): void {
//     const minutes: number = Math.floor(this.timeLeft / 60);
//     const seconds: number = this.timeLeft % 60;
//     this.timerDisplay = `${this.padNumber(minutes)}:${this.padNumber(seconds)}`;
//   }

//   padNumber(num: number): string {
//     return num < 10 ? `0${num}` : num.toString();
//   }

//   submitExam(isTimeout: boolean = false): void {
//     if (!isTimeout && !this.isEightyPercentAnswered()) {
//       alert('You must answer at least 80% of the questions before submitting.');
//       return;
//     }

//     const confirmation = isTimeout || confirm('Do you want to submit the exam?');
//     if (confirmation) {
//       const examData = this.prepareExamSubmissionData();
//       console.log('Submitting exam data:', examData);

//       this.examResultService.submitExam(examData).subscribe(
//         (response) => {
//           console.log('API Response:', response); // Log response
//           localStorage.setItem('examResult', JSON.stringify(response)); // Store response in local storage
//           this.router.navigate(['/result']); // Navigate to result page

//           if (isTimeout) {
//             alert('Time is up! The exam was automatically submitted.');
//           }
//         },
//         (error) => {
//           console.error('Error submitting exam:', error);
//         }
//       );
//     }
//   }

//   prepareExamSubmissionData(): any {
//     const userAnswers = Object.keys(this.answers).map((questionId) => {
//       return {
//         questionId: Number(questionId),
//         selectedOptionIds: Array.isArray(this.answers[Number(questionId)])
//           ? this.answers[Number(questionId)]
//           : [this.answers[Number(questionId)]], // Ensure it's always an array
//       };
//     });

//     const markforreview = Object.keys(this.markedForReview).length;
//     const durationSpent = Math.floor((this.totalExamTime - this.timeLeft) / 60); // Time spent in minutes

//     return {
//       examId: this.examId,
//       userId: this.userId, // Get the userId from the decoded JWT token
//       duration: durationSpent, // Time spent
//       markforreview: markforreview,
//       userAnswers: userAnswers,
//     };
//   }

//   isEightyPercentAnswered(): boolean {
//     const totalQuestions = this.filteredQuestions.length;
//     const answeredQuestions = Object.keys(this.answers).length;
//     return answeredQuestions / totalQuestions >= 0.8; // Check if 80% questions are answered
//   }

//   selectAnswer(optionId: number): void {
//     if (!this.answers[this.selectedQuestion!.questionId]) {
//       this.answers[this.selectedQuestion!.questionId] = [];
//     }

//     const index = this.answers[this.selectedQuestion!.questionId].indexOf(optionId);
//     if (index === -1) {
//       this.answers[this.selectedQuestion!.questionId].push(optionId); // Add answer
//     } else {
//       this.answers[this.selectedQuestion!.questionId].splice(index, 1); // Deselect answer
//     }
//   }

//   isSelected(optionId: number): boolean {
//     return this.answers[this.selectedQuestion!.questionId]?.includes(optionId);
//   }

//   markForReview(): void {
//     this.markedForReview[this.selectedQuestion!.questionId] = true;
//   }

//   isMarkedForReview(questionId: number): boolean {
//     return this.markedForReview[questionId] || false;
//   }

//   nextQuestion(): void {
//     if (this.currentQuestionIndex < this.filteredQuestions.length - 1) {
//       this.currentQuestionIndex++;
//       this.selectedQuestion = this.filteredQuestions[this.currentQuestionIndex];
//     }
//   }

//   prevQuestion(): void {
//     if (this.currentQuestionIndex > 0) {
//       this.currentQuestionIndex--;
//       this.selectedQuestion = this.filteredQuestions[this.currentQuestionIndex];
//     }
//   }

//   getQuestionStatusColor(question: Question): string {
//     if (this.selectedQuestion?.questionId === question.questionId) {
//       return 'btn-primary';
//     } else if (this.answers[question.questionId]?.length > 0) {
//       return 'btn-success';
//     } else if (this.isMarkedForReview(question.questionId)) {
//       return 'btn-warning';
//     } else {
//       return 'btn-outline-secondary';
//     }
//   }

//   @HostListener('window:beforeunload', ['$event'])
//   handleBeforeUnload(event: BeforeUnloadEvent): void {
//     event.preventDefault();
//     event.returnValue = '';
//   }

//   removeUnloadEvent(): void {
//     window.removeEventListener('beforeunload', this.handleBeforeUnload);
//   }
// }














import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SectionService } from '../../services/section.service';
import { QuestionService, Question } from '../../services/question.service';
import { ExamResultService } from '../../services/exam-result.service';
import { AuthService } from '../../services/auth.service';
import { ExamService } from '../../services/exam.service';
import { Exam } from '../../Interface/exam.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-section',
  standalone: true,
  templateUrl: './section.component.html',
  styleUrls: ['./section.component.css'],
  imports: [CommonModule, FormsModule, NavbarComponent],
})
export class SectionComponent implements OnInit, OnDestroy {
  examId: number | null = null;
  userId: string | null = null;
  sections: any[] = [];
  allQuestions: Question[] = [];
  filteredQuestions: Question[] = [];
  selectedSection: any | null = null;
  selectedQuestion: Question | null = null;
  isRandomized: boolean = false; // To track if the exam should be randomized

  mediaType: number = 0;
  mediaURL: string = '';

  // Timer related variables
  timeLeft: number = 0;
  timerDisplay: string = '';
  timerInterval: any = null;
  totalExamTime: number = 0;

  // State for tracking answers and question statuses
  answers: { [questionId: number]: number[] } = {};
  markedForReview: { [questionId: number]: boolean } = {};
  currentQuestionIndex: number = 0;

  constructor(
    private sectionService: SectionService,
    private questionService: QuestionService,
    private examResultService: ExamResultService,
    private examService: ExamService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.examId = Number(this.route.snapshot.paramMap.get('examId'));
    this.userId = this.authService.getUserId();

    if (this.examId) {
      this.loadExamDetails();
      this.loadAllQuestions();
    }

    // Prevent user from going back to previous page
    history.pushState(null, '', location.href);
    window.addEventListener('popstate', () => {
      history.pushState(null, '', location.href);
    });
  }

  ngOnDestroy(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
    this.removeUnloadEvent();
  }

  getVideoIframeUrl(mediaUrl: string | null): SafeResourceUrl | null {
    if (!mediaUrl) return null;

    if (mediaUrl.includes('drive.google.com')) {
      const fileId = mediaUrl.split('/d/')[1]?.split('/')[0];
      const embedUrl = `https://drive.google.com/file/d/${fileId}/preview`;
      return this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
    }

    return this.sanitizer.bypassSecurityTrustResourceUrl(mediaUrl);
  }

  loadExamDetails(): void {
    if (this.examId) {
      this.examService.getExamById(this.examId).subscribe((exam: Exam) => {
        if (exam && exam.duration) {
          this.totalExamTime = exam.duration * 60; // Convert minutes to seconds
          this.timeLeft = this.totalExamTime; // Set initial time left
          this.isRandomized = exam.isRandmized; // Set the exam's randomized flag
          this.startTimer(); // Start the timer with the updated timeLeft
          this.loadSections(); // Load sections once exam details are loaded
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

  loadAllQuestions(): void {
    this.questionService.getAllQuestions().subscribe(
      (questions: Question[]) => {
        this.allQuestions = questions;
        console.log('All questions loaded:', this.allQuestions);
      },
      (error: any) => {
        console.error('Error loading questions', error);
      }
    );
  }

  selectSection(section: any): void {
    this.selectedSection = section;

    const sectionQuestions = this.allQuestions.filter(
      (q) => q.sectionId === section.sectionId
    );

    // If the exam is randomized, shuffle questions; otherwise, load them serially
    if (this.isRandomized) {
      this.filteredQuestions = this.randomizeAndLimitQuestions(sectionQuestions, section.numberOfQuestions);
    } else {
      this.filteredQuestions = sectionQuestions.slice(0, section.numberOfQuestions); // Serial order
    }

    this.currentQuestionIndex = 0;
    this.selectedQuestion = this.filteredQuestions[this.currentQuestionIndex];
  }

  // Randomize questions and their options, then limit the number of questions
  randomizeAndLimitQuestions(questions: Question[], limit: number): Question[] {
    const shuffledQuestions = [...questions].sort(() => 0.5 - Math.random());

    // Shuffle the options inside each question to ensure options match the randomized questions
    shuffledQuestions.forEach(question => {
      question.options = question.options.sort(() => 0.5 - Math.random());
    });

    return shuffledQuestions.slice(0, limit); // Limit the questions based on section's numberOfQuestions
  }

  startTimer(): void {
    this.updateTimerDisplay();
    this.timerInterval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
        this.updateTimerDisplay();
      } else {
        clearInterval(this.timerInterval);
        this.submitExam(true); // Auto-submit when time runs out
      }
    }, 1000);
  }

  updateTimerDisplay(): void {
    const minutes: number = Math.floor(this.timeLeft / 60);
    const seconds: number = this.timeLeft % 60;
    this.timerDisplay = `${this.padNumber(minutes)}:${this.padNumber(seconds)}`;
  }

  padNumber(num: number): string {
    return num < 10 ? `0${num}` : num.toString();
  }

  submitExam(isTimeout: boolean = false): void {
    if (!isTimeout && !this.isEightyPercentAnswered()) {
      alert('You must answer at least 80% of the questions before submitting.');
      return;
    }

    const confirmation = isTimeout || confirm('Do you want to submit the exam?');
    if (confirmation) {
      const examData = this.prepareExamSubmissionData();
      console.log('Submitting exam data:', examData);

      this.examResultService.submitExam(examData).subscribe(
        (response) => {
          console.log('API Response:', response); // Log response
          localStorage.setItem('examResult', JSON.stringify(response)); // Store response in local storage
          this.router.navigate(['/result']); // Navigate to result page

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

  prepareExamSubmissionData(): any {
    const userAnswers = Object.keys(this.answers).map((questionId) => {
      return {
        questionId: Number(questionId),
        selectedOptionIds: Array.isArray(this.answers[Number(questionId)])
          ? this.answers[Number(questionId)]
          : [this.answers[Number(questionId)]], // Ensure it's always an array
      };
    });

    const markforreview = Object.keys(this.markedForReview).length;
    const durationSpent = Math.floor((this.totalExamTime - this.timeLeft) / 60); // Time spent in minutes

    return {
      examId: this.examId,
      userId: this.userId, // Get the userId from the decoded JWT token
      duration: durationSpent, // Time spent
      markforreview: markforreview,
      userAnswers: userAnswers,
    };
  }

  isEightyPercentAnswered(): boolean {
    const totalQuestions = this.filteredQuestions.length;
    const answeredQuestions = Object.keys(this.answers).length;
    return answeredQuestions / totalQuestions >= 0.1; // Check if 80% questions are answered
  }

  selectAnswer(optionId: number): void {
    if (!this.answers[this.selectedQuestion!.questionId]) {
      this.answers[this.selectedQuestion!.questionId] = [];
    }

    const index = this.answers[this.selectedQuestion!.questionId].indexOf(optionId);
    if (index === -1) {
      this.answers[this.selectedQuestion!.questionId].push(optionId); // Add answer
    } else {
      this.answers[this.selectedQuestion!.questionId].splice(index, 1); // Deselect answer
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

  @HostListener('window:beforeunload', ['$event'])
  handleBeforeUnload(event: BeforeUnloadEvent): void {
    event.preventDefault();
    event.returnValue = '';
  }

  removeUnloadEvent(): void {
    window.removeEventListener('beforeunload', this.handleBeforeUnload);
  }
}
