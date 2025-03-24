interface Question {
  id: number;
  question: string;
  type: string;
  options: string[];
}


interface Feature {
  id: number;
  imgSrc:string;
  heading:string;
  subHeading:string;
  buttonTitle:string;
  buttonUrl:string;
}

interface User {
  name: string;
  email: string;
  id: string;
}

interface AgentProps {
  userName: string;
  userId?: string;
  interviewId?: string;
  feedbackId?: string;
  type: "generate" | "interview";
  questions?: string[];
}

interface RouteParams {
  params: Promise<Record<string, string>>;
  searchParams: Promise<Record<string, string>>;
}

interface GetFeedbackByInterviewIdParams {
  interviewId: string;
  userId: string;
}

interface GetLatestInterviewsParams {
  userId: string;
  limit?: number;
}

interface SignInParams {
  email: string;
  idToken: string;
}

interface SignUpParams {
  uid: string;
  name: string;
  email: string;
  password: string;
}

type FormType = "sign-in" | "sign-up";

interface InterviewFormProps {
  interviewId: string;
  role: string;
  level: string;
  type: string;
  techstack: string[];
  amount: number;
}

interface TechIconProps {
  techStack: string[];
}


interface Feedback {
  _id?:string;
  postedBy: string;
  profileImg?: string;
  ratings?: number;
  feedback?: string;
  postedDate: Date;
  isTechnicalIssue?: boolean;
  topic?: string;
}