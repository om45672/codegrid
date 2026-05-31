"use client";

import { Spinner } from "@/components/ui/spinner";
import { useProblem } from "@/hooks/use-problem";
import CodeEditorPanel from "@/modules/problems/components/code-editor-panel";
import { ExecutionResults } from "@/modules/problems/components/execution-results";
import { ProblemDescription } from "@/modules/problems/components/problem-description";
import { ProblemHeader } from "@/modules/problems/components/problem-header";
import { ProblemTabs } from "@/modules/problems/components/problem-tabs";
import TestCasesPanel from "@/modules/problems/components/testcases-panel";
import { useEditor } from "@/modules/problems/hooks/use-editor";
import { useSubmissionHistory } from "@/modules/problems/hooks/use-submission-history";
import type { ProblemData, ProfileSubmission } from "@/modules/problems/types";
import { useParams } from "next/navigation";

const ProblemIdPage = () => {
  const params = useParams<{ id: string }>();
  const { problem, isLoading } = useProblem(params.id);
  const { submissionHistory } = useSubmissionHistory(params.id);

  if (isLoading) {
    return (
      <div className="flex h-screen flex-col items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="flex h-screen flex-col items-center justify-center">
        <p className="text-muted-foreground">Problem not found.</p>
      </div>
    );
  }

  return (
    <ProblemWorkspace
      key={problem.id}
      problem={problem}
      submissionHistory={submissionHistory}
    />
  );
};

type ProblemWorkspaceProps = {
  problem: ProblemData;
  submissionHistory: ProfileSubmission[];
};

const ProblemWorkspace = ({
  problem,
  submissionHistory,
}: ProblemWorkspaceProps) => {
  const {
    selectedLanguage,
    setSelectedLanguage,
    code,
    setCode,
    isRunning,
    isSubmitting,
    executionResponse,
    handleRun,
    handleSubmit,
  } = useEditor(problem);

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl p-6">
        <ProblemHeader problem={problem} />
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-6">
            <ProblemDescription problem={problem} />
            <ProblemTabs
              problem={problem}
              submissionHistory={submissionHistory}
            />
          </div>

          <div className="space-y-6">
            <CodeEditorPanel
              code={code}
              onCodeChange={setCode}
              selectedLanguage={selectedLanguage}
              onLanguageChange={setSelectedLanguage}
              onRun={handleRun}
              onSubmit={handleSubmit}
              isRunning={isRunning}
              isSubmitting={isSubmitting}
            />
            <TestCasesPanel testCases={problem.testCases} />
            <ExecutionResults executionResponse={executionResponse} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemIdPage;
