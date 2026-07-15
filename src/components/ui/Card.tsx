interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className = '' }: CardProps) {
  return (
    <div className={`rounded-xl bg-gray-900 border border-gray-800 p-4 ${className}`}>
      {children}
    </div>
  );
}
