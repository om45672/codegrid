import { prisma } from "@/lib/db";
import { UserRole } from "@/lib/generated/prisma/enums";
import {
  getJudge0languageId,
  pollBatchResults,
  submitBatch,
  type Judge0Submission,
} from "@/lib/judge0";
import { currentUserRole, getCurrentUserData } from "@/modules/auth/actions";
import { problemSchema } from "@/modules/problems/schema";
import type { LanguageKey } from "@/modules/problems/types";

import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const userRole = await currentUserRole();
    const user = await getCurrentUserData();

    if (!user) {
      return NextResponse.json({ error: "User not found" });
    }

    if (userRole !== UserRole.ADMIN) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const parseResult = problemSchema.safeParse(await request.json());

    if (!parseResult.success) {
      return NextResponse.json(
        { error: "Invalid problem data", details: parseResult.error.flatten() },
        { status: 400 },
      );
    }

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
    } = parseResult.data;

    if (!difficulty) {
      return NextResponse.json(
        { error: "Difficulty is required" },
        { status: 400 },
      );
    }

    for (const [language, solutionCode] of Object.entries(
      referenceSolutions,
    ) as Array<[LanguageKey, string]>) {
      // 1.get judge0 language id for current lang
      const languageId = getJudge0languageId(language);

      // 2. prepare judge0 submissions for all test cases

      const submissions: Judge0Submission[] = testCases.map(({ input, output }) => ({
        source_code: solutionCode,
        language_id: languageId,
        stdin: input,
        expected_output: output,
      }));
      // 3. Submit all testcases in one batch

      const submissionResults = await submitBatch(submissions);
      // 4. Extract tokens from response
      const tokens = submissionResults.map((res) => res.token);

      // 5. Poll judge0 until all submissions are done
      const results = await pollBatchResults(tokens);
      // 6. validate that each test cases

      for (let i = 0; i < results.length; i++) {
        const result = results[i];

        if (result.status.id !== 3) {
          return NextResponse.json(
            {
              error: `Validation failed for ${language}`,
              testCase: {
                input: submissions[i].stdin,
                expectedOutput: submissions[i].expected_output,
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
        examples,
        constraints,
        testCases,
        codeSnippets,
        referenceSolutions,
        userId: user.id,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Problem Created Successfully",
        data: newProblem,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Failed to save problem to database" },
      { status: 500 },
    );
  }
}
