import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { db } from "@/lib/db";
import type { Task } from "@/types/task";
import type { Status } from "@/types/statuses";
import type { Priority } from "@/types/priority";

export const TASK_KEYS = {
  all: ["tasks"] as const,
  lists: () => [...TASK_KEYS.all, "list"] as const,
  list: (filter?: Status) => [...TASK_KEYS.lists(), filter] as const,
  count: () => [...TASK_KEYS.all, "count"] as const,
  stats: () => [...TASK_KEYS.all, "stats"] as const,
} as const;

// Queries
export const useTasksQuery = (filter?: Status) => {
  console.log(filter, "useTasksQuery");

  console.log(TASK_KEYS.list(filter));

  return useQuery({
    queryKey: TASK_KEYS.list(filter),
    queryFn: async () => {
      console.log("refetching tasks");

      if (!filter) {
        return db.tasks.orderBy("createdAt").reverse().toArray();
      }
      return db.tasks
        .where("status")
        .equals(filter)
        .reverse()
        .sortBy("createdAt");
    },
  });
};

export const useTaskCountQuery = () => {
  return useQuery({
    queryKey: TASK_KEYS.count(),
    queryFn: () => db.tasks.where("status").notEqual("completed").count(),
  });
};

export const useTaskStatsQuery = () => {
  return useQuery({
    queryKey: TASK_KEYS.stats(),
    queryFn: async () => {
      const [total, active, completed] = await Promise.all([
        db.tasks.count(),
        db.tasks.where("status").equals("active").count(),
        db.tasks.where("status").equals("completed").count(),
      ]);
      return { total, active, completed };
    },
  });
};

// Mutations
export const useAddTaskMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (taskData: { title: string; priority: Priority }) => {
      const newTask: Omit<Task, "id"> = {
        ...taskData,
        status: "not-started",
        createdAt: new Date(),
      };

      return db.tasks.add({
        ...newTask,
        id: crypto.randomUUID(),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TASK_KEYS.all });
    },
  });
};

export const useDeleteTaskMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (taskId: string) => db.tasks.delete(taskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TASK_KEYS.all });
    },
  });
};

export const useUpdateTaskStatusMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: Status }) => {
      const updates: Partial<Task> = {
        status,
        updatedAt: new Date(),
      };

      if (status === "completed") {
        updates.completedAt = new Date();
      }

      return db.tasks.update(id, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TASK_KEYS.all });
    },
  });
};

export const useClearCompletedMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => db.tasks.where("status").equals("completed").delete(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TASK_KEYS.all });
    },
  });
};
