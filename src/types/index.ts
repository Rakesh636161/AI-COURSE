export interface MCQQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface WritingQuestion {
  id: string;
  question: string;
  expectedKeyPoints: string[];
  rubric: string;
}

export interface Assessment {
  mcqs: MCQQuestion[]; // 3 MCQs based on lecture video
  writingQuestions: WritingQuestion[]; // 2 Writing questions to be solved in book/written
}

export interface WrittenAnswerSubmission {
  questionId: string;
  questionText?: string;
  textAnswer?: string;
  uploadedImageUrl?: string;
  score: number; // 0 to 20 points
  isCorrect?: boolean;
  feedback: string;
  modelAnswer?: string;
}

export interface MCQEvaluationResult {
  questionId: string;
  questionText: string;
  selectedOptionIndex?: number;
  correctOptionIndex: number;
  isCorrect: boolean;
  explanation: string;
}

export interface AssessmentSubmission {
  mcqAnswers: Record<string, number>;
  writtenAnswers: WrittenAnswerSubmission[];
  mcqResults?: MCQEvaluationResult[];
  totalScore: number; // 0 to 100%
  passed: boolean; // true if >= 75%
  evaluatedAt: string;
}

export interface AssessmentEvaluationResponse {
  passed: boolean;
  totalScore: number;
  mcqPoints: number;
  writingPoints: number;
  passingThreshold: number;
  nextChapterUnlocked: boolean;
  message: string;
  mcqResults: MCQEvaluationResult[];
  writtenResults: WrittenAnswerSubmission[];
  assessmentSubmission: AssessmentSubmission;
}

export interface ContentSection {
  title: string;
  content: string;
  codeSnippet?: string;
  codeLanguage?: string;
}

export interface ChapterContent {
  introduction: string;
  sections: ContentSection[];
  keyTakeaways: string[];
}

export interface CourseChapter {
  id?: string;
  chapterNumber: number;
  title: string;
  description: string;
  duration: string;
  videoId?: string;
  videoTitle?: string;
  videoChannel?: string;
  completed: boolean;
  isUnlocked: boolean; // Locked until previous lecture is passed with >= 75%
  assessmentScore?: number;
  assessment?: Assessment;
  assessmentSubmission?: AssessmentSubmission;
  content?: ChapterContent;
}

export interface PDFSource {
  fileName: string;
  fileSize: number;
  summary: string;
}

export interface Course {
  id: string;
  userId: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advance' | 'Advanced';
  duration: string;
  noOfChapters: number;
  numberOfChapters?: number;
  includeVideo: boolean;
  thumbnailUrl: string;
  thumbnailPrompt?: string;
  pdfSources?: PDFSource[];
  chapters: CourseChapter[];
  progress: number;
  createdAt: string;
  updatedAt?: string;
  creatorName: string;
  userEmail?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  coursesCreated?: number;
}
