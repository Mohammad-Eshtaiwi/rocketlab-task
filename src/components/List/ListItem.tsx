import { Task } from "@/types/task";
import { Status } from "@/types/statuses";
import { useTasks } from "@/hooks/useTasks";
import StatusIndicator from "../StatusIndicator";
import Button from "../Button";
import styles from "./style.module.scss";

interface ListItemProps {
  task: Task;
}

export default function ListItem({ task }: ListItemProps) {
  const { deleteTask, updateTaskStatus, isDeleting, isUpdating } = useTasks();

  const handleStatusChange = () => {
    let nextStatus: Status;
    switch (task.status) {
      case "not-started":
        nextStatus = "active";
        break;
      case "active":
        nextStatus = "completed";
        break;
      case "completed":
        nextStatus = "active";
        break;
      default:
        nextStatus = "not-started";
        break;
    }
    task.status === "not-started";
    updateTaskStatus(task.id, nextStatus);
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${task.title}"?`)) {
      deleteTask(task.id);
    }
  };

  return (
    <div className={styles.listItem}>
      <button
        className={styles.statusButton}
        onClick={handleStatusChange}
        disabled={isUpdating}
        data-status={task.status}
        aria-label={`Mark task as ${
          task.status === "completed" ? "active" : "completed"
        }`}
      >
        <StatusIndicator status={task.status} />
      </button>
      <p
        className={`${styles.title} ${
          task.status === "completed" ? styles.completed : ""
        }`}
      >
        {task.title}
      </p>
      <div className={styles.actions}>
        <span className={styles.priority} data-priority={task.priority}>
          {task.priority}
        </span>
        <Button
          variant="secondary"
          size="sm"
          onClick={handleDelete}
          disabled={isDeleting}
          aria-label={`Delete task: ${task.title}`}
        >
          ×
        </Button>
      </div>
    </div>
  );
}
