import { useTaskCountQuery, useTaskStatsQuery } from "@/lib/queries/tasks";

export const useTaskCounter = () => {
  const countQuery = useTaskCountQuery();
  const statsQuery = useTaskStatsQuery();

  const leftTasks = countQuery.data ?? 0;
  const leftTasksText = leftTasks > 98 ? "99+" : leftTasks.toString();

  return {
    leftTasks,
    leftTasksText,
    stats: statsQuery.data ?? { total: 0, active: 0, completed: 0 },
    isLoading: countQuery.isLoading || statsQuery.isLoading,
    error: countQuery.error || statsQuery.error,
  };
};
