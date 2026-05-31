import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle2, Clock, Code, CpuIcon, XCircle } from "lucide-react";
import type { SubmissionWithTestCases } from "../types";

const parseMetricValues = (value: string | null): number[] => {
  if (!value) return [];

  try {
    const parsed: unknown = JSON.parse(value);

    if (!Array.isArray(parsed)) return [];

    return parsed
      .map((entry) => Number.parseFloat(String(entry).replace(" s", "")))
      .filter(Number.isFinite);
  } catch {
    return [];
  }
};

const getAverage = (values: number[]) =>
  values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;

export const SubmissionDetails = ({
  submission,
}: {
  submission: SubmissionWithTestCases;
}) => {
  const isSuccess = submission.status === "Accepted";
  const averageMemory = getAverage(parseMetricValues(submission.memory));
  const averageTime = getAverage(parseMetricValues(submission.time));

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Submission Details</CardTitle>
          {isSuccess ? (
            <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20">
              <CheckCircle2 className="mr-1 h-3 w-3" />
              Success
            </Badge>
          ) : (
            <Badge className="bg-red-500/10 text-red-500 hover:bg-red-500/20">
              <XCircle className="mr-1 h-3 w-3" />
              Failed
            </Badge>
          )}
        </div>
        <CardDescription>
          Submitted at {new Date(submission.createdAt).toLocaleString()}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="flex items-center gap-2">
            <Code className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Language</p>
              <p className="text-sm text-muted-foreground">{submission.language}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <CpuIcon className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Memory (avg)</p>
              <p className="text-sm text-muted-foreground">
                {averageMemory.toFixed(2)} KB
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Time (avg)</p>
              <p className="text-sm text-muted-foreground">
                {averageTime.toFixed(3)} s
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
