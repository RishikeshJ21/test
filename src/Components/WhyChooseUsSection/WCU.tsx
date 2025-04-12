
import React from 'react';
import { BriefcaseIcon, RocketIcon, HeadphonesIcon, BarChartIcon, UsersIcon, StarIcon } from 'lucide-react';
import FeatureCard from './FeatureCard';
 

interface IconGridProps {
  variant?: 'default' | 'centered' | 'bordered' | 'minimal';
}

const IconGrid: React.FC<IconGridProps> = ({ variant = 'default' }) => {
  const features = [
    {
      icon: <RocketIcon className="w-6 h-6" />,
      title: "Zero Cost, Maximum Support",
      description: "Forget about expensive courses and hidden fees. We're here to support your creative journey without costing you a penny.",
      bgColor: "bg-purple-500"
    },
    {
      icon: <HeadphonesIcon className="w-6 h-6" />,
      title: "Expert Guidance",
      description: "Learn from experienced creators and industry professionals who understand what it takes to succeed in a competitive landscape.",
      bgColor: "bg-blue-500"
    },
    {
      icon: <BriefcaseIcon className="w-6 h-6" />,
      title: "Sustainable Career Building",
      description: "We help you go beyond growth and build a lasting career. Master monetization strategies and secure brand deals.",
      bgColor: "bg-green-500"
    },
    {
      icon: <UsersIcon className="w-6 h-6" />,
      title: "Community-Driven Growth",
      description: "Connect with a thriving network of creators who share your passion. Collaborate and grow together while supporting one another.",
      bgColor: "bg-orange-500"
    },
    {
      icon: <StarIcon className="w-6 h-6" />,
      title: "Proven Success Stories",
      description: "Our platform has already empowered countless creators to reach new heights. Be inspired by their journeys and take your path.",
      bgColor: "bg-yellow-500"
    },
    {
      icon: <BarChartIcon className="w-6 h-6" />,
      title: "Data-Driven Insights",
      description: "Make informed decisions with our analytics tools. Track your growth, understand your audience, and optimize your content.",
      bgColor: "bg-red-500"
    }
  ];

  const getCardClassNames = () => {
    switch (variant) {
      case 'centered':
        return "text-center";
      case 'bordered':
        return "border-2 border-gray-200";
      case 'minimal':
        return "shadow-none border border-gray-100";
      default:
        return "";
    }
  };

  const getIconClassNames = (bgColor: string) => {
    switch (variant) {
      case 'centered':
        return `${bgColor} mx-auto`;
      case 'minimal':
        return `${bgColor} bg-opacity-10 text-${bgColor.replace('bg-', '')}`;
      default:
        return bgColor;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-5">
      {features.map((feature, index) => (
        <FeatureCard
          key={index}
          icon={feature.icon}
          title={feature.title}
          description={feature.description}
          className={getCardClassNames()}
          iconClassName={getIconClassNames(feature.bgColor)}
        />
      ))}
    </div>
  );
};

export default IconGrid;
