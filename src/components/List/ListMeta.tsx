"use client";
import clsx from "clsx";
import { useTaskCounter } from "@/hooks/useTaskCounter";
import { useTasks } from "@/hooks/useTasks";
import { FilterType } from "@/hooks/useTaskFilters";
import styles from "./style.module.scss";

interface ListMetaProps {
  activeFilter: FilterType;
  setActiveFilter: (filter: FilterType) => void;
  filterOptions: { label: string; value: FilterType }[];
}

export default function ListMeta({
  activeFilter,
  setActiveFilter,
  filterOptions,
}: ListMetaProps) {
  const { leftTasksText } = useTaskCounter();
  const { clearCompleted, isClearing } = useTasks(
    activeFilter === "all" ? undefined : activeFilter
  );

  const handleClearCompleted = () => {
    if (window.confirm("Are you sure you want to clear all completed tasks?")) {
      clearCompleted();
    }
  };

  return (
    <div className={clsx(styles.meta, styles.listItem)}>
      <span>{leftTasksText} items left</span>
      <ul className={styles.filters}>
        {filterOptions.map((option) => (
          <li
            key={option.value}
            className={activeFilter === option.value ? styles.active : ""}
            onClick={() => setActiveFilter(option.value)}
          >
            {option.label}
          </li>
        ))}
      </ul>
      <button
        role="button"
        className={styles.clear}
        disabled={isClearing}
        onClick={handleClearCompleted}
      >
        {isClearing ? "Clearing..." : "Clear Completed"}
      </button>
    </div>
  );
}
