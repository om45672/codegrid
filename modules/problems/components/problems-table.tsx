"use client"
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { ProblemsHeader } from "./problems-header";
import { useProblemFilters } from "../hooks/use-problem-fiters";
import { ProblemsFilters } from "./problem-filters";
import { usePagination } from "../hooks/use-pagination";
import { ProblemRow } from "./problem-row";
import { ProblemsEmpty } from "./problem-empty";
import { ProblemsPagination } from "./problems-pagination";

const ProblemsTable = ({ problems = [], user }: any) => {

  const filters = useProblemFilters(problems);
  const pagination = usePagination(filters.filteredProblems, 10);

  return (
    <div className="w-full mx-w-7xl mx-auto space-y-8 p-8">
      <ProblemsHeader onCreatePlaylist={() => { }} />

      <ProblemsFilters
        search={filters.search}
        onSearchChange={filters.setSearch}
        difficulty={filters.difficulty}
        onDifficultyChange={filters.setDifficulty}
        selectedTag={filters.selectedTag}
        onTagChange={filters.setSelectedTag}
        allTags={filters.allTags}

      />

      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-25">Solved</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Tags</TableHead>
                <TableHead className="w-30">Difficulty</TableHead>
                <TableHead className="w-50">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pagination.paginatedItems.length > 0 ? (
                pagination.paginatedItems.map((problem) => (
                  <ProblemRow
                    key={problem.id}
                    problem={problem}
                    user={user}
                    onDelete={() => { }}
                    onSave={() => { }}
                  />
                ))
              ) : (
                <ProblemsEmpty />
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination */}
      {pagination.showPagination && (
        <ProblemsPagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          displayRange={pagination.displayRange}
          canGoPrevious={pagination.canGoPrevious}
          canGoNext={pagination.canGoNext}
          onPrevious={pagination.goToPreviousPage}
          onNext={pagination.goToNextPage}
        />
      )}
    </div>
  )
}

export default ProblemsTable