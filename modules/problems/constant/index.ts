import type { Difficulty } from "@/lib/generated/prisma/enums";
import type { EditorProps } from "@monaco-editor/react";

export const DIFFICULTIES = ["EASY", "MEDIUM", "HARD"] as const satisfies readonly Difficulty[];
export const ITEMS_PER_PAGE = 5;

export const DEFAULT_FILTERS = {
  search: "",
  difficulty: "ALL",
  tag: "ALL",
};

export const DIFFICULTY_COLORS = {
  EASY: "bg-green-100 text-green-800 hover:bg-green-100",
  MEDIUM: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
  HARD: "bg-red-100 text-red-800 hover:bg-red-100",
} satisfies Record<Difficulty, string>;

export const getDifficultyColor = (difficulty?: Difficulty | null) => {
  return difficulty ? DIFFICULTY_COLORS[difficulty] : "";
};

export const LANGUAGE_OPTIONS = [
  { value: 'JAVASCRIPT', label: 'JavaScript' },
  { value: 'PYTHON', label: 'Python' },
  { value: 'JAVA', label: 'Java' },
];


export const getEditorLanguage = (language:string) => {
  return language.toLowerCase();
};

export const EDITOR_OPTIONS = {
  minimap: { enabled: false },
  fontSize: 16,
  lineNumbers: 'on',
  roundedSelection: false,
  scrollBeyondLastLine: false,
  automaticLayout: true,
  tabSize: 2,
  wordWrap: 'on',
} satisfies EditorProps["options"];
