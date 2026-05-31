import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar, CheckCircle2, Clock, Code, Cpu, XCircle } from "lucide-react";
import type { ProfileSubmission } from "../types";

const parseMetricAverage = (
  value: string | null,
  unitToRemove = "",
): number | null => {
  if (!value) return null;

  try {
    const parsed: unknown = JSON.parse(value);

    if (!Array.isArray(parsed) || parsed.length === 0) return null;

    const numbers = parsed
      .map((entry) => Number.parseFloat(String(entry).replace(unitToRemove, "")))
      .filter(Number.isFinite);

    return numbers.length
      ? numbers.reduce((sum, entry) => sum + entry, 0) / numbers.length
      : null;
  } catch {
    return null;
  }
};

const formatMemory = (memory: string | null) => {
  const averageMemory = parseMetricAverage(memory);
  return averageMemory === null ? "N/A" : `${averageMemory.toFixed(2)} KB`;
};

const formatTime = (time: string | null) => {
  const averageTime = parseMetricAverage(time, " s");
  return averageTime === null ? "N/A" : `${averageTime.toFixed(3)} s`;
};

const formatDate = (date: Date | string) => {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const SubmissionHistory = ({
  submissions = [],
}: {
  submissions?: ProfileSubmission[];
}) => {
  if (!submissions.length) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Submission History</CardTitle>
          <CardDescription>No submissions yet</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Submission History</CardTitle>
        <CardDescription>Your previous submissions for this problem</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-3">
            {submissions.map((submission) => (
              <Card key={submission.id} className="bg-muted/50">
                <CardContent className="pb-4 pt-4">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {submission.status === "Accepted" ? (
                        <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20">
                          <CheckCircle2 className="mr-1 h-3 w-3" />
                          Accepted
                        </Badge>
                      ) : (
                        <Badge className="bg-red-500/10 text-red-500 hover:bg-red-500/20">
                          <XCircle className="mr-1 h-3 w-3" />
                          Failed
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {formatDate(submission.createdAt)}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="flex items-center gap-2">
                      <Code className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs font-medium text-muted-foreground">
                          Language
                        </p>
                        <p className="text-sm font-medium">{submission.language}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Cpu className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs font-medium text-muted-foreground">
                          Memory
                        </p>
                        <p className="text-sm font-medium">
                          {formatMemory(submission.memory)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs font-medium text-muted-foreground">
                          Time
                        </p>
                        <p className="text-sm font-medium">
                          {formatTime(submission.time)}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
