import styles from "./style.module.scss";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export default function Input({ className, ...props }: InputProps) {
  return <input className={`${styles.input} ${className || ""}`} {...props} />;
}
