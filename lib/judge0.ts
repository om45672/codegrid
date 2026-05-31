import axios from "axios";
import type { LanguageKey } from "@/modules/problems/types";

export type Judge0LanguageId = 63 | 71 | 62;

export type Judge0Submission = {
  source_code: string;
  language_id: Judge0LanguageId;
  stdin: string;
  expected_output?: string;
  base64_encoded?: boolean;
  wait?: boolean;
};

export type Judge0SubmissionToken = {
  token: string;
};

export type Judge0Result = {
  stdout: string | null;
  stderr: string | null;
  compile_output: string | null;
  status: {
    id: number;
    description: string;
  };
  memory: string | number | null;
  time: string | number | null;
};

type Judge0BatchResponse<T> = T[] | { submissions: T[] };

export function getJudge0languageId(language: LanguageKey | string): Judge0LanguageId {
  const languageMap = {
    PYTHON: 71,
    JAVASCRIPT: 63,
    JAVA: 62,
  } satisfies Record<LanguageKey, Judge0LanguageId>;

  const languageId = languageMap[language.toUpperCase() as LanguageKey];

  if (!languageId) {
    throw new Error(`Unsupported language: ${language}`);
  }

  return languageId;
}

export function getLanguageName(languageId: number) {
  const LANGUAGE_NAMES = {
    63: "JavaScript",
    71: "Python",
    62: "Java",
  };
  return LANGUAGE_NAMES[languageId as keyof typeof LANGUAGE_NAMES] || "Unknown";
}

const unwrapBatchResponse = <T>(data: Judge0BatchResponse<T>): T[] =>
  Array.isArray(data) ? data : data.submissions;

export async function submitBatch(
  submissions: Judge0Submission[],
): Promise<Judge0SubmissionToken[]> {
  const options = {
    method: "POST",
    url: `${process.env.JUDGE0_URL}/submissions/batch`,
    params: {
      base64_encoded: "false",
    },
    headers: {
      "x-rapidapi-key": process.env.RAPIDAPI_KEY!,
      "x-rapidapi-host": process.env.RAPIDAPI_HOST!,
      "Content-Type": "application/json",
    },

    data: {
      submissions: submissions,
    },
  };

  const { data } =
    await axios.request<Judge0BatchResponse<Judge0SubmissionToken>>(options);

  return unwrapBatchResponse(data);
}

export async function pollBatchResults(tokens: string[]): Promise<Judge0Result[]> {
  while (true) {
    const options = {
      method: "GET",
      url: `${process.env.JUDGE0_URL}/submissions/batch`,
      params: {
        tokens: tokens.join(","),
        base64_encoded: "false",
        fields: "*",
      },
      headers: {
        "x-rapidapi-key": process.env.RAPIDAPI_KEY!,
        "x-rapidapi-host": process.env.RAPIDAPI_HOST!,
        "Content-Type": "application/json",
      },
    };

    const { data } =
      await axios.request<Judge0BatchResponse<Judge0Result>>(options);

    const results = unwrapBatchResponse(data);

    const isAllDone = results.every(
      (result) => result.status.id !== 1 && result.status.id !== 2,
    );

    if (isAllDone) return results;

    await sleep(1000);
  }
}

export const sleep = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));
