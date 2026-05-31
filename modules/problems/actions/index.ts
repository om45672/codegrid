"use server";

import { prisma } from "@/lib/db";
import {
  getLanguageName,
  pollBatchResults,
  submitBatch,
  type Judge0LanguageId,
  type Judge0Submission,
} from "@/lib/judge0";
import { getCurrentUserData } from "@/modules/auth/actions";
import type {
  ExecuteCodeResult,
  ProblemData,
  ProblemWithSolvedBy,
  ProfileSubmission,
} from "../types";
import { toProblemData, toProblemWithSolvedBy } from "../types";

type ProblemsResult =
  | { success: true; data: ProblemWithSolvedBy[] }
  | { success: false; error: string };

type ProblemResult =
  | { success: true; data: ProblemData | null }
  | { success: false; error: string };

type SubmissionsResult =
  | { success: true; data: ProfileSubmission[] }
  | { success: false; error: string };

export const getAllProblems = async (): Promise<ProblemsResult> => {
  try {
    const problems = await prisma.problem.findMany({
      include: {
        solvedBy: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return {
      success: true,
      data: problems.map(toProblemWithSolvedBy),
    };
  } catch (error) {
    console.error("Error fetching problems:", error);
    return { success: false, error: "Failed to fetch problems" };
  }
};

export const getProblemById = async (id: string): Promise<ProblemResult> => {
  try {
    const problem = await prisma.problem.findUnique({
      where: {
        id,
      },
    });

    return {
      success: true,
      data: problem ? toProblemData(problem) : null,
    };
  } catch (error) {
    console.error("Error fetching problem:", error);
    return { success: false, error: "Failed to fetch problem" };
  }
};

export const executeCode = async (
  sourceCode: string,
  languageId: Judge0LanguageId,
  stdin: string[],
  expectedOutputs: string[],
  id: string,
): Promise<ExecuteCodeResult> => {
  const user = await getCurrentUserData();

  if (!user) {
    return { success: false, error: "User not authenticated" };
  }

  if (
    stdin.length === 0 ||
    expectedOutputs.length !== stdin.length
  ) {
    return { success: false, error: "Invalid Test Cases" };
  }

  const submissions: Judge0Submission[] = stdin.map((input) => ({
    source_code: sourceCode,
    language_id: languageId,
    stdin: input,
    base64_encoded: false,
    wait: false,
  }));

  const submitResponse = await submitBatch(submissions);
  const tokens = submitResponse.map((res) => res.token);
  const results = await pollBatchResults(tokens);

  let allPassed = true;

  const detailedResults = results.map((result, i) => {
    const stdout = result.stdout?.trim() || null;
    const expectedOutput = expectedOutputs[i]?.trim() ?? "";
    const passed = stdout === expectedOutput;

    if (!passed) allPassed = false;

    return {
      testCase: i + 1,
      passed,
      stdout,
      expected: expectedOutput,
      stderr: result.stderr || null,
      compileOutput: result.compile_output || null,
      status: result.status.description,
      memory: result.memory ? `${result.memory} KB` : null,
      time: result.time ? `${result.time} s` : null,
    };
  });

  const submission = await prisma.submission.create({
    data: {
      userId: user.id,
      problemId: id,
      sourceCode,
      language: getLanguageName(languageId),
      stdin: stdin.join("\n"),
      stdout: JSON.stringify(detailedResults.map((r) => r.stdout)),
      stderr: detailedResults.some((r) => r.stderr)
        ? JSON.stringify(detailedResults.map((r) => r.stderr))
        : null,
      compileOutput: detailedResults.some((r) => r.compileOutput)
        ? JSON.stringify(detailedResults.map((r) => r.compileOutput))
        : null,
      status: allPassed ? "Accepted" : "Wrong Answer",
      memory: detailedResults.some((r) => r.memory)
        ? JSON.stringify(detailedResults.map((r) => r.memory))
        : null,
      time: detailedResults.some((r) => r.time)
        ? JSON.stringify(detailedResults.map((r) => r.time))
        : null,
    },
  });

  if (allPassed) {
    await prisma.problemSolved.upsert({
      where: {
        userId_problemId: { userId: user.id, problemId: id },
      },
      update: {},
      create: {
        userId: user.id,
        problemId: id,
      },
    });
  }

  const testCaseResults = detailedResults.map((result) => ({
    submissionId: submission.id,
    testCase: result.testCase,
    passed: result.passed,
    stdout: result.stdout,
    expected: result.expected,
    stderr: result.stderr,
    compileOutput: result.compileOutput,
    status: result.status,
    memory: result.memory,
    time: result.time,
  }));

  await prisma.testCaseResult.createMany({ data: testCaseResults });

  const submissionWithTestCases = await prisma.submission.findUniqueOrThrow({
    where: { id: submission.id },
    include: {
      testCases: true,
    },
  });

  return {
    success: true,
    submission: submissionWithTestCases,
  };
};

export const getAllSubmissionByCurrentUserForProblem = async (
  problemId: string,
): Promise<SubmissionsResult> => {
  const user = await getCurrentUserData();

  if (!user) {
    return { success: false, error: "User not authenticated" };
  }

  const submissions = await prisma.submission.findMany({
    where: {
      problemId,
      userId: user.id,
    },
  });

  return {
    success: true,
    data: submissions,
  };
};
