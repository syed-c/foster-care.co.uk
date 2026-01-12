interface SectionHeadingProps {
  children: React.ReactNode;
  className?: string;
}

export const SectionHeading = ({ children, className = '' }: SectionHeadingProps) => {
  return (
    <h2 className={`text-3xl font-semibold tracking-tight text-center mb-12 ${className}`}>
      {children}
    </h2>
  );
};