import { Status } from "@/types/statuses";
import { FaClock, FaCheck, FaCircle } from "react-icons/fa";
import styles from "./style.module.scss";

export default function StatusIndicator(
  props: {
    status: Status;
  } & React.ButtonHTMLAttributes<HTMLButtonElement>
) {
  const icon = {
    active: <FaClock />,
    completed: <FaCheck />,
    "not-started": <FaCircle />,
  };
  return (
    <span className={styles.statusButton} {...props}>
      {icon[props.status]}
    </span>
  );
}
