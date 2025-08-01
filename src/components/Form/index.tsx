"use client";
import { priority } from "@/types/priority";
import Input from "@/components/Input";
import Select from "@/components/Select";
import Button from "@/components/Button";
import styles from "./style.module.scss";

export default function Form() {
  return (
    <form
      className={styles.form}
      onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const task = formData.get("task") as string;
        const priority = formData.get("priority") as string;

        if (!task) {
          alert("Task is required");
          return;
        }

        (e.target as HTMLFormElement).reset();
      }}
    >
      <Input type="text" name="task" placeholder="Add a new task" />
      <Select
        name="priority"
        id="priority"
        options={[
          ...priority.map((p) => p.charAt(0).toUpperCase() + p.slice(1)),
        ]}
      />
      <Button type="submit" size="sm">
        Add
      </Button>
    </form>
  );
}
