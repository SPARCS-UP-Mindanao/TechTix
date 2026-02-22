import { RefAttributes, SVGProps } from 'react';
import { icons, LucideProps } from 'lucide-react';

type SVGAttributes = Partial<SVGProps<SVGSVGElement>>;
export type IconComponentAttributes = RefAttributes<SVGSVGElement> & SVGAttributes;

export type IconName = keyof typeof icons;

interface IconProps extends LucideProps {
  name: IconName;
  color?: string;
  size?: number;
  className?: string | undefined;
}

const Icon = ({ name, color, size, className, ...props }: IconProps) => {
  const LucideIcon = icons[name as IconName];

  return <LucideIcon name={name} color={color} size={size || 16} className={className} {...props} />;
};

export default Icon;
