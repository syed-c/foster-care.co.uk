interface InfoCardProps {
  heading?: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
}

export const InfoCard = ({ 
  heading, 
  description, 
  children,
  className = '' 
}: InfoCardProps) => {
  return (
    <div className={`rounded-2xl shadow-sm border border-gray-200 p-8 bg-white ${className}`}>
      {heading && <h3 className="text-xl font-semibold mb-3">{heading}</h3>}
      {description && <p className="text-gray-600 mb-4">{description}</p>}
      {children}
    </div>
  );
};