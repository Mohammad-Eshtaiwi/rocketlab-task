import { useState } from "react";
import {
  useTasksQuery,
  useAddTaskMutation,
  useDeleteTaskMutation,
  useUpdateTaskStatusMutation,
  useClearCompletedMutation,
} from "@/lib/queries/tasks";
import type { Status } from "@/types/statuses";
import type { Priority } from "@/types/priority";

export const useTasks = (filter?: Status) => {
  const tasksQuery = useTasksQuery(filter);

  const addTaskMutation = useAddTaskMutation();
  const deleteTaskMutation = useDeleteTaskMutation();
  const updateStatusMutation = useUpdateTaskStatusMutation();
  const clearCompletedMutation = useClearCompletedMutation();

  const addTask = (title: string, priority: Priority) => {
    if (!title.trim()) {
      throw new Error("Task title is required");
    }
    addTaskMutation.mutate({ title: title.trim(), priority });
  };

  const deleteTask = (id: string) => {
    deleteTaskMutation.mutate(id);
  };

  const updateTaskStatus = (id: string, status: Status) => {
    updateStatusMutation.mutate({ id, status });
  };

  const clearCompleted = () => {
    clearCompletedMutation.mutate();
  };

  return {
    // Data
    tasks: tasksQuery.data ?? [],
    isLoading: tasksQuery.isLoading,
    error: tasksQuery.error,

    // Actions
    addTask,
    deleteTask,
    updateTaskStatus,
    clearCompleted,

    // States
    isAdding: addTaskMutation.isPending,
    isDeleting: deleteTaskMutation.isPending,
    isUpdating: updateStatusMutation.isPending,
    isClearing: clearCompletedMutation.isPending,

    // Action errors
    addError: addTaskMutation.error,
    deleteError: deleteTaskMutation.error,
    updateError: updateStatusMutation.error,
    clearError: clearCompletedMutation.error,
  };
};
