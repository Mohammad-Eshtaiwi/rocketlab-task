import { Status } from "@/types/statuses";
import StatusIndicator from "../StatusIndicator";
import styles from "./style.module.scss";

export default function ListItem({
  status,
  title,
}: {
  status: Status;
  title: string;
}) {
  return (
    <div className={styles.listItem}>
      <StatusIndicator status={status} />
      <p className={styles.title}>{title}</p>
    </div>
  );
}
