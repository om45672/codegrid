import { getProblemById } from "@/modules/problems/actions";
import { useEffect, useState } from "react"

export const useProblem = (id: string) => {
    const [problem, setProblem] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchProblem = async () => {
            try {
                setIsLoading(true);
                const problemData = await getProblemById(id);
                if (problemData.success) {
                    // @ts-expect-error ignore
                    setProblem(problemData.data)
                }
            } catch (error) {
                console.error('Error fetching problem:', error);
            }
            finally {
                setIsLoading(false);
            }
        }
        fetchProblem();
    },[id])
    return { problem, isLoading };
}

