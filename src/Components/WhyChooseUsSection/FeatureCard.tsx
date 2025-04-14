import React from 'react';
import { cn } from '../../lib/utils';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  className?: string;
  iconClassName?: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
  className,
  iconClassName
}) => {
  return (
    <div className={cn("bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1", className)}>
      <div className={cn("p-3 rounded-lg text-black mb-4 inline-flex items-center justify-center", iconClassName)}>
        
     {title === "Data-Driven Insights" ? icon : <img   src={icon || "/placeholder.svg"} alt={title} className="w-6 h-6" />}
      </div>
      <h3 className="text-xl font-semibold text-black mb-3 font-sans">{title}</h3>
      <p className="text-gray-600 leading-relaxed font-sans">{description}</p>
    </div>
  );
};

export default FeatureCard;
