"use client";

import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  defaultFormValues,
  problemSchema,
  type ProblemFormData,
} from "@/modules/problems/schema";
import {
  SAMPLE_PROBLEMS,
  type SampleProblemType,
} from "@/modules/problems/constant/sample-problem";

export type TagsArrayControls = {
  fields: Array<{ id: string; value: string }>;
  append: (value: string) => void;
  remove: (index: number) => void;
  replace: (values: string[]) => void;
};

type CreateProblemResponse =
  | { success: true }
  | { success?: false; error?: string };

const getErrorMessage = (error: unknown, fallback: string) =>
  error instanceof Error ? error.message : fallback;

export function useCreateProblem() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [sampleType, setSampleType] = useState<SampleProblemType>("DP");

  const form = useForm<ProblemFormData>({
    resolver: zodResolver(problemSchema),
    defaultValues: defaultFormValues,
  });

  const testCasesArray = useFieldArray({
    control: form.control,
    name: "testCases" as const,
  });

  const tags = useWatch({
    control: form.control,
    name: "tags",
  }) ?? [];
  const updateTags = (nextTags: string[]) => {
    form.setValue("tags", nextTags.length ? nextTags : [""], {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const tagsArray: TagsArrayControls = {
    fields: tags.map((value, index) => ({ id: `tag-${index}`, value })),
    append: (value) => updateTags([...tags, value]),
    remove: (index) => updateTags(tags.filter((_, i) => i !== index)),
    replace: updateTags,
  };

  const onSubmit = async (values: ProblemFormData) => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/create-problem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = (await response.json()) as CreateProblemResponse;

      if (data.success) {
        toast.success("Problem created successfully");
        router.push("/problems");
      } else {
        toast.error(data.error ?? "Failed to create problem");
      }
    } catch (error) {
      console.error("Error creating problem:", error);
      toast.error(getErrorMessage(error, "Failed to create problem"));
    } finally {
      setIsLoading(false);
    }
  };

  const loadSampleData = () => {
    const sampleData = SAMPLE_PROBLEMS[sampleType];
    tagsArray.replace(sampleData.tags);
    testCasesArray.replace(sampleData.testCases);

    form.reset(sampleData);
  };

  return {
    form,
    testCasesArray,
    tagsArray,
    isLoading,
    sampleType,
    setSampleType,
    onSubmit: form.handleSubmit(onSubmit),
    loadSampleData,
  };
}
