import styles from "./style.module.scss";

export default function ListContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className={styles.listContainer}>{children}</div>;
}
