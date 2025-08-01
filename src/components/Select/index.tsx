import styles from './style.module.scss';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: string[];
  // Add any custom props here if needed
}

export default function Select({ options, className, children, ...props }: SelectProps) {
  return (
    <select 
      className={`${styles.select} ${className || ''}`}
      {...props}
    >
      {children || options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}