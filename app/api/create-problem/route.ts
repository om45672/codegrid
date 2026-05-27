import { currentUserRole } from "@/modules/auth/actions";
import { userRole as UserRole } from "@/lib/generated/prisma/enums";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const userRole = await currentUserRole();

    if (userRole !== UserRole.ADMIN) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
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
      } = await request.json();
      
      if(!title || !description || !difficulty  || !testCases || !codeSnippets || !referenceSolutions) {
        return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
      }

      if(!Array.isArray(testCases) || testCases.length === 0) {
        return NextResponse.json({ error: "At least one test case is required" }, { status: 400 });
      }

      for (const [language, solutionCode] of Object.entries(referenceSolutions)) {
        if (!solutionCode) {
          return NextResponse.json({ error: "Invalid reference solution format" }, { status: 400 });
          }
          // 1. get judge0 language id for current lang
          // 2. prepare the judge0 submissions for all the testcases
          // 3. submit all testcases in one batch
          // 4. Extract tokens from response
          // 5. Poll judge0 until all submissions are processed
          // 6.
      }

  } catch (error) {
    return NextResponse.json(
      { message: "Error creating problem" },
      { status: 500 },
    );
  }
}
