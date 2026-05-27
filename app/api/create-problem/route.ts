import { currentUserRole, getCurrentUserData } from "@/modules/auth/actions";
import { userRole as UserRole, Difficulty } from "@/lib/generated/prisma/enums";
import { NextRequest, NextResponse } from "next/server";

type JsonObject = { readonly [key: string]: JsonValue | null };
type JsonArray = ReadonlyArray<JsonValue | null>;
type JsonValue = string | number | boolean | JsonObject | JsonArray | { path: string[]; json: string };
import {
  getJudege0languageId,
  pollBatchResults,
  submitBatch,
} from "@/lib/judge0";
import { prisma } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const userRole = await currentUserRole();
    const user = await getCurrentUserData();
    if (!user || "success" in user) {
      return NextResponse.json({ error: "User not found" }, { status: 401 });
    }
    if (userRole !== UserRole.ADMIN) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const body = await request.json() as {
      title: string;
      description: string;
      difficulty: Difficulty;
      tags: string[];
      examples: JsonValue;
      constraints: string;
      testCases: Array<{ input: string; output: string }>;
      codeSnippets: JsonValue;
      referenceSolutions: Record<string, string>;
    };

    const {
      title,
      description,
      difficulty,
      tags,
      examples,
      constraints,
      testCases,
      codeSnippets,
      referenceSolutions,
    } = body;

    if (
      !title ||
      !description ||
      !difficulty ||
      !testCases ||
      !codeSnippets ||
      !referenceSolutions
    ) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 },
      );
    }

    if (!Array.isArray(testCases) || testCases.length === 0) {
      return NextResponse.json(
        { error: "At least one test case is required" },
        { status: 400 },
      );
    }

    for (const [language, solutionCode] of Object.entries(referenceSolutions)) {
      if (!solutionCode) {
        return NextResponse.json(
          { error: "Invalid reference solution format" },
          { status: 400 },
        );
      }
      // 1. get judge0 language id for current lang
      const languageId = getJudege0languageId(language);
      // 2. prepare the judge0 submissions for all the testcases

      const submissions = testCases.map(
        (testCase: { input: string; output: string }) => {
          return {
            language_id: languageId,
            source_code: solutionCode,
            stdin: testCase.input,
            expected_output: testCase.output,
          };
        },
      );
      // 3. submit all testcases in one batch
      const submissionResult = await submitBatch(submissions);
      // 4. Extract tokens from response
      const tokens = submissionResult.map(
        (submission: { token: string }) => submission.token,
      );
      // 5. Poll judge0 until all submissions are processed
      const results = await pollBatchResults(tokens);
      // 6. Validate that each test cases passed
      for (let i = 0; i < results.length; i++) {
        const result = results[i];
        if (result.status.id !== 3) {
          return NextResponse.json(
            {
              error: `Validation failed for language ${language} on test case ${i + 1}`,
              testCase: {
                input: testCases[i].input,
                expectedOutput: testCases[i].output,
                actualOutput: result.stdout,
                error: result.stderr || result.compile_output,
              },
              details: result,
            },
            { status: 400 },
          );
        }
      }
    }
    const newProblem = await prisma.problem.create({
      data: {
        title,
        description,
        difficulty,
        tags,
        example: examples,
        constraints,
        testCases,
        codeSnippets,
        referenceSolutions,
        userId: user.id,
      }
    });
    return NextResponse.json({
      success: true,
      message: "Problem created successfully",
      data: newProblem,
    },{ status: 201 }
    );
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Failed to save problem to database" },
      { status: 500 },
    );
  }
}
