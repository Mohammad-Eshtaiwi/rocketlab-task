"use client";
import clsx from "clsx";
import styles from "./style.module.scss";

export default function ListMeta({ leftTasks }: { leftTasks: number }) {
  const leftTasksText = leftTasks > 98 ? "99+" : leftTasks;
  return (
    <div className={clsx(styles.meta, styles.listItem)}>
      <span>{leftTasksText} items left</span>
      <ul className={styles.filters}>
        <li>All</li>
        <li>Active</li>
        <li>Completed</li>
      </ul>
      <button
        role="button"
        className={styles.clear}
        disabled={leftTasks === 0}
        onClick={() => {}}
      >
        Clear Completed
      </button>
    </div>
  );
}
