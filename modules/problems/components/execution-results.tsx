"use client";
import { SubmissionDetails } from "./submission-details";
import { TestCaseTable } from "./testcase-table";
import type { ExecuteCodeResult } from "../types";

export function ExecutionResults({
  executionResponse,
}: {
  executionResponse: ExecuteCodeResult | null;
}){
      if (!executionResponse?.success) {
    return null;
  }

  return (
     <div className="space-y-4 mt-4">
      <SubmissionDetails submission={executionResponse.submission} />
      <TestCaseTable testCases={executionResponse.submission.testCases} />
    </div>
  )
}
