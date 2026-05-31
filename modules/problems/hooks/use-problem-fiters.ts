import { useState , useMemo } from "react";
import type { DifficultyFilter } from "../types";

type FilterableProblem = {
  title: string;
  difficulty: string;
  tags: string[];
};

export function useProblemFilters<TProblem extends FilterableProblem>(
  problems: TProblem[] = [],
){
      const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState<DifficultyFilter>("ALL");
  const [selectedTag, setSelectedTag] = useState("ALL");

//   Extract all unique tags from the problems
const allTags = useMemo(()=>{
    const tagsSet = new Set<string>();
    problems.forEach((p)=>p.tags?.forEach((t)=>tagsSet.add(t)));

    return Array.from(tagsSet)
},[problems]);

 const filteredProblems = useMemo(() => {
    return problems
      .filter((problem) =>
        problem.title.toLowerCase().includes(search.toLowerCase())
      )
      .filter((problem) =>
        difficulty === "ALL" ? true : problem.difficulty === difficulty
      )
      .filter((problem) =>
        selectedTag === "ALL" ? true : problem.tags?.includes(selectedTag)
      );
  }, [problems, search, difficulty, selectedTag]);

return {
    search,
    difficulty,
    selectedTag,
    allTags,

    setSearch,
    setDifficulty,
    setSelectedTag,

    filteredProblems
}

}
