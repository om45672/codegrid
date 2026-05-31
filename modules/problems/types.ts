import type {
  Playlist,
  Problem,
  ProblemSolved,
  Submission,
  TestCaseResult,
} from "@/lib/generated/prisma/client";
import type { ProblemGetPayload } from "@/lib/generated/prisma/models/Problem";
import type { SubmissionGetPayload } from "@/lib/generated/prisma/models/Submission";
import type { UserGetPayload } from "@/lib/generated/prisma/models/User";
import type { Difficulty } from "@/lib/generated/prisma/enums";

export type LanguageKey = "JAVASCRIPT" | "PYTHON" | "JAVA";

export type ProblemTestCase = {
  input: string;
  output: string;
};

export type ProblemExample = ProblemTestCase & {
  explanation?: string;
};

export type LanguageRecord<T> = Record<LanguageKey, T>;

type TypedProblemJson<TProblem extends Problem> = Omit<
  TProblem,
  "examples" | "testCases" | "codeSnippets" | "referenceSolutions"
> & {
  examples: LanguageRecord<ProblemExample> | ProblemExample[];
  testCases: ProblemTestCase[];
  codeSnippets: LanguageRecord<string>;
  referenceSolutions: LanguageRecord<string>;
};

export type ProblemData = TypedProblemJson<Problem>;

export type ProblemWithSolvedBy = TypedProblemJson<
  ProblemGetPayload<{ include: { solvedBy: true } }>
>;

export type CurrentUserData = UserGetPayload<{
  include: {
    submissions: true;
    solvedProblems: true;
    playlists: true;
  };
}>;

export type SubmissionWithTestCases = SubmissionGetPayload<{
  include: { testCases: true };
}>;

export type ExecuteCodeResult =
  | { success: false; error: string }
  | { success: true; submission: SubmissionWithTestCases };

export type DifficultyFilter = Difficulty | "ALL";

export type PlaylistListItem = Pick<Playlist, "id" | "name" | "description">;

export type ProfileSubmission = Submission;
export type ProfileSolvedProblem = ProblemSolved;
export type SubmissionTestCaseResult = TestCaseResult;

export const toProblemData = (problem: Problem): ProblemData =>
  problem as ProblemData;

export const toProblemWithSolvedBy = (
  problem: ProblemGetPayload<{ include: { solvedBy: true } }>,
): ProblemWithSolvedBy => problem as ProblemWithSolvedBy;
