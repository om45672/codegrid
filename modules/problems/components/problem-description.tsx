import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";
import { ConstraintsSection } from "./constraint-section";
import { ExampleSection } from "./example-section";
import type { ProblemData, ProblemExample } from "../types";

const normalizeExampleValue = (value: unknown) =>
  String(value ?? "")
    .replace(/[^0-9a-zA-Z]+/g, "")
    .toLowerCase();

const getExamples = (problem: ProblemData): ProblemExample[] => {
  const languageExamples = Array.isArray(problem.examples)
    ? problem.examples
    : Object.values(problem.examples);

  const examplesRaw = Array.isArray(problem.testCases)
    ? problem.testCases
    : languageExamples;

  return examplesRaw.map((example) => {
    if ("explanation" in example && example.explanation) return example;

    const match = languageExamples.find((languageExample) => {
      const exampleInput = normalizeExampleValue(example.input);
      const languageInput = normalizeExampleValue(languageExample.input);

      return (
        languageInput.includes(exampleInput) ||
        exampleInput.includes(languageInput)
      );
    });

    return match?.explanation
      ? { ...example, explanation: match.explanation }
      : example;
  });
};

export function ProblemDescription({ problem }: { problem: ProblemData }) {
  const examples = getExamples(problem);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="size-5" />
          Problem Description
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="space-y-6">
          <p className="text-foreground leading-relaxed">
            {problem.description}
          </p>

          {examples.map((example, index) => (
            <ExampleSection
              key={`${index}-${example.input}`}
              example={example}
              index={index}
            />
          ))}

          <ConstraintsSection constraints={problem.constraints} />
        </div>
      </CardContent>
    </Card>
  );
}
