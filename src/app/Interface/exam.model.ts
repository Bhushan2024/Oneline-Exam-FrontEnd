export interface CreateExamDto {
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  duration: number;
  totalMarks: number;
  passingMarks: number;
  createdByUserId: string;
  isRandmized: boolean;
}

export interface UpdateExamDto {
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  duration: number;
  totalMarks: number;
  passingMarks: number;
  createdByUserId: string;
  isRandmized: boolean;
  isPublished: boolean;
  createdDate: Date;
}

export interface Exam {
  examId: number;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  duration: number;
  totalMarks: number;
  passingMarks: number;
  createdByUserId: string;
  isRandmized: boolean;
  isPublished: boolean;
  createdDate: Date;
}


// Section model for creating a new section
export interface SectionPostDTO {
  examId: number;              // Foreign key to Exam
  title: string;               // Section title (e.g., Math, Science)
  numberOfQuestions: number;   // Number of questions in the section
  totalMarks: number;          // Total marks for the section
  passingMarks: number;        // Minimum marks required to pass
  questions: QuestionPostDTO[]; // List of questions in the section
  weightage: number;    // Section weightage percentage (1-100) 
}

// Section model for fetching a section
export interface SectionGetDTO {
  sectionId: number;           // Section identifier
  examId: number;              // Foreign key to Exam
  title: string;               // Section title
  numberOfQuestions: number;   // Number of questions in the section
  totalMarks: number;          // Total marks for the section
  passingMarks: number;        // Minimum marks required to pass
  questions: QuestionGetDTO[];  // List of questions in the section
  weightage: number;    // Section weightage percentage (1-100) 
}

// Question model for creating a new question
export interface QuestionPostDTO {
  questionText: string;         // The question text
  isMultipleChoice: boolean;          // Indicates if the question allows multiple answers
  createdDate: Date;            // Date the question was created
  options: OptionPostDTO[];     // List of options for the question
  mediaType: number;
  mediaUrl: string;
}

// Question model for fetching a question
export interface QuestionGetDTO {
  questionId: number;           // Question identifier
  questionText: string;         // The question text
  isMultipleChoice: boolean;          // Indicates if the question allows multiple answers
  createdDate: Date;            // Date the question was created
  options: OptionGetDTO[];      // List of options for the question
  mediaType: number;
  mediaUrl: string;
}
// Option model for creating a new option
export interface OptionPostDTO {
  optionText: string;           // Text for the option
  isCorrect: boolean;           // Indicates if the option is correct
  marks: number
}

// Option model for fetching an option
export interface OptionGetDTO {
  optionId: number;             // Option identifier
  optionText: string;           // Text for the option
  isCorrect: boolean;           // Indicates if the option is correct
  marks: number
}
