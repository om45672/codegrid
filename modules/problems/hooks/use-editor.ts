"use client";

import { getJudge0languageId } from "@/lib/judge0";
import { useState } from "react";
import { toast } from "sonner";
import { executeCode } from "../actions";
import type { ExecuteCodeResult, LanguageKey, ProblemData } from "../types";

export function useEditor(
  problem: ProblemData,
  initialLanguage: LanguageKey = "JAVASCRIPT",
) {
  const [selectedLanguage, setSelectedLanguageState] =
    useState<LanguageKey>(initialLanguage);
  const [code, setCode] = useState(problem.codeSnippets[initialLanguage] ?? "");
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [executionResponse, setExecutionResponse] =
    useState<ExecuteCodeResult | null>(null);

  const setSelectedLanguage = (language: LanguageKey) => {
    setSelectedLanguageState(language);
    setCode(problem.codeSnippets[language] ?? "");
  };

  const handleRun = () => {
    toast.success("Currently in development");
  };

  const handleSubmit = async () => {
    try {
      setIsRunning(true);
      setIsSubmitting(true);
      const languageId = getJudge0languageId(selectedLanguage);
      const stdin = problem.testCases.map((tc) => tc.input);
      const expectedOutputs = problem.testCases.map((tc) => tc.output);

      const res = await executeCode(
        code,
        languageId,
        stdin,
        expectedOutputs,
        problem.id,
      );
      setExecutionResponse(res);

      if (res.success) {
        toast.success("Code executed successfully");
      } else {
        toast.error(res.error);
      }
    } catch (error) {
      console.error("Error executing code", error);
      toast.error("Error executing code");
    } finally {
      setIsRunning(false);
      setIsSubmitting(false);
    }
  };

  return {
    selectedLanguage,
    setSelectedLanguage,
    code,
    setCode,
    isRunning,
    isSubmitting,
    executionResponse,
    handleRun,
    handleSubmit,
  };
}
