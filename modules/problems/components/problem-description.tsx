import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";
import { ExampleSection } from "./example-section";
import { ConstraintsSection } from "./constraint-section";

export function ProblemDescription({ problem }: any) {

  console.log(problem?.examples)

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
            {problem?.description}
          </p>
          {
            (() => {
              // Prefer `testCases` (array of distinct examples). Fall back to language-keyed `examples`.
              const languageExamples = Array.isArray(problem?.examples)
                ? problem.examples
                : Object.values(problem?.examples ?? {});

              const examplesRaw = Array.isArray(problem?.testCases)
                ? problem.testCases
                : Array.isArray(problem?.examples)
                ? problem.examples
                : Object.values(problem?.examples ?? {});

              // If a testCase/example lacks an explanation, try to fill it
              // from any matching language example (match by input or output).
              const examples = (examplesRaw ?? []).map((ex: any) => {
                if (ex?.explanation) return ex;
                const normalize = (s: any) =>
                  String(s ?? "").replace(/[^0-9a-zA-Z]+/g, "").toLowerCase();

                const match = (languageExamples ?? []).find((le: any) => {
                  if (!le?.input || !ex?.input) return false;
                  const a = normalize(le.input);
                  const b = normalize(ex.input);
                  return a.includes(b) || b.includes(a);
                });
                return match?.explanation ? { ...ex, explanation: match.explanation } : ex;
              });

              return examples.map((example: any, index: number) => (
                <ExampleSection
                  key={`${index}-${String(example?.input ?? "")}`}
                  example={example}
                  index={index}
                />
              ));
            })()
          }
          <ConstraintsSection constraints={problem?.constraints}/>
        </div>
      </CardContent>
    </Card>
  );
}