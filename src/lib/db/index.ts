import Dexie, { Table } from "dexie";
import type { Task } from "@/types/task";

export class TaskDatabase extends Dexie {
  tasks!: Table<Task>;

  constructor() {
    super("TaskDatabase");
    this.version(1).stores({
      tasks: "++id, title, status, priority, createdAt, completedAt",
    });
  }
}

export const db = new TaskDatabase();
