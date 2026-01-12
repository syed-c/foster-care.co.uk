interface SectionWrapperProps {
  children: React.ReactNode;
  id?: string;
  variant?: 'white' | 'tint' | 'gradient';
  spacing?: 'large' | 'small';
}

export const SectionWrapper = ({ 
  children, 
  id,
  variant = 'white',
  spacing = 'large'
}: SectionWrapperProps) => {
  const backgrounds = {
    white:       "bg-white",
    tint:        "bg-[#FAFAF7]", // soft off-white
    gradient:    "bg-gradient-to-br from-green-700 to-green-900 text-white" // dark green gradient
  }

  const spacingClasses = {
    large: "py-20 lg:py-40", // ~160px
    small: "py-10 lg:py-20"  // ~80px
  }

  return (
    <section 
      id={id}
      className={`${backgrounds[variant]} ${spacingClasses[spacing]}`}
    >
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 relative z-10">
        {children}
      </div>
    </section>
  )
};