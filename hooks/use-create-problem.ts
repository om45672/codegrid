"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { defaultFormValues, problemSchema } from "@/modules/problems/schema";
// import { SAMPLE_PROBLEMS } from "@/modules/problems/constant/sample-problem";
import { z } from "zod";
import { SAMPLE_PROBLEMS } from "@/modules/problems/constant/sample-problem";


export function useCreateProblem() { 
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [sampleType, setSampleType] = useState("DP");

    const form = useForm({
        resolver: zodResolver(problemSchema),
        defaultValues: defaultFormValues
    })

    const testCasesArray = useFieldArray({
        control: form.control,
        name: "testCases" as const,
    });

    const tagsArray = useFieldArray({
        control: form.control,
        name: "tags" as any,
    });

    const onSubmit = async (values: typeof defaultFormValues) => { };
    
    const loadSampleData = () => {
        const sampleData = SAMPLE_PROBLEMS[sampleType as keyof typeof SAMPLE_PROBLEMS];
        tagsArray.replace(sampleData.tags.map((tag: any) => tag));
        testCasesArray.replace(sampleData.testCases.map((testCase: any) => testCase));

        form.reset(sampleData as any);
    }

    return {
    form,
    testCasesArray,
    tagsArray,
    isLoading,
    sampleType,
    setSampleType,
    onSubmit: form.handleSubmit(onSubmit as any),
    loadSampleData,
  };

}