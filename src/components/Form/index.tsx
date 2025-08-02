"use client";
import { FormEvent } from "react";
import { priority } from "@/types/priority";
import type { Priority } from "@/types/priority";
import { useTasks } from "@/hooks/useTasks";
import Input from "@/components/Input";
import Select from "@/components/Select";
import Button from "@/components/Button";
import styles from "./style.module.scss";

export default function Form() {
  const { addTask, isAdding, addError } = useTasks();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const task = formData.get("task") as string;
    const priorityValue = formData.get("priority") as string;

    if (!task?.trim()) {
      alert("Task is required");
      return;
    }

    try {
      // Map the display value back to the priority type
      const priorityMap: Record<string, Priority> = {
        "Low": "low",
        "Medium": "medium", 
        "High": "high"
      };
      const mappedPriority = priorityMap[priorityValue] || "low";
      
      addTask(task, mappedPriority);
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to add task");
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <Input type="text" name="task" placeholder="Add a new task" />
      <Select
        name="priority"
        id="priority"
        options={priority.map((p) => p.charAt(0).toUpperCase() + p.slice(1))}
      />
      <Button type="submit" size="sm" disabled={isAdding}>
        {isAdding ? "Adding..." : "Add"}
      </Button>
      {addError && (
        <p className={styles.error}>
          Failed to add task: {addError.message}
        </p>
      )}
    </form>
  );
}
