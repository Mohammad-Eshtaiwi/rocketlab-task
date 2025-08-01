import styles from './style.module.scss';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary';
}

export default function Button({ 
  children, 
  className, 
  size = 'md', 
  variant = 'primary', 
  ...props 
}: ButtonProps) {
  const sizeClass = styles[`button--${size}`];
  const variantClass = styles[`button--${variant}`];
  
  return (
    <button 
      className={`${styles.button} ${sizeClass} ${variantClass} ${className || ''}`}
      {...props}
    >
      {children}
    </button>
  );
}