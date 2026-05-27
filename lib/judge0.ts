import axios from "axios";

export type Judge0Submission = {
  language_id: number;
  source_code: string;
  stdin: string;
  expected_output: string;
};

export type Judge0BatchResponse = {
  token: string;
}[];

export type Judge0Result = {
  token: string;
  status: {
    id: number;
    description?: string;
  };
  stdout?: string | null;
  stderr?: string | null;
  compile_output?: string | null;
  [key: string]: unknown;
};

export function getJudege0languageId(language: string) {
  const languageMap = {
    PYTHON: 71,
    JAVASCRIPT: 63,
    JAVA: 62,
    CPP: 54,
  };
  return languageMap[language.toUpperCase() as keyof typeof languageMap];
}

export async function submitBatch(submissions: Judge0Submission[]) {
  const options = {
    method: "POST",
    url: "https://judge0-extra-ce1.p.rapidapi.com/submissions/batch",
    params: {
      base64_encoded: "false",
    },
    headers: {
      "x-rapidapi-key": "71bc34cf72msh57e9f30deea75d2p1cf975jsn83461c7dbeeb",
      "x-rapidapi-host": "judge0-extra-ce1.p.rapidapi.com",
      "Content-Type": "application/json",
    },
    data: {
      submissions: submissions,
    },
  };

  const { data } = await axios.request<Judge0BatchResponse>(options);
  return data;
}

export async function pollBatchResults(tokens: string[]) {
  while (true) {
    const options = {
      method: "GET",
      url: "https://judge0-extra-ce1.p.rapidapi.com/submissions/batch",
      params: {
        tokens: tokens.join(","),
        base64_encoded: "true",
        fields: "*",
      },
      headers: {
        "x-rapidapi-key": "71bc34cf72msh57e9f30deea75d2p1cf975jsn83461c7dbeeb",
        "x-rapidapi-host": "judge0-extra-ce1.p.rapidapi.com",
        "Content-Type": "application/json",
      },
      };
      
      const { data } = await axios.request<{ submissions: Judge0Result[] }>(options);
      const results = data.submissions;

      const isAlldone = results.every((result: Judge0Result) => result.status.id > 2);

      if (isAlldone) {
        return results;
      }
      await sleep(1000);
  }
}

export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));