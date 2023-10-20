import { icons, LucideProps } from "lucide-react";

export type IconName = keyof typeof icons;

interface IconProps extends LucideProps {
  name: string;
  color?: string;
  size?: number;
  className?: string | undefined;
}

const Icon = ({ name, color, size, className, ...props }: IconProps) => {
  if (!(name in icons)) {
    return;
  }

  const LucideIcon = icons[name as IconName];

  return (
    <LucideIcon
      name={name}
      color={color}
      size={size || 18}
      className={className}
      {...props}
    />
  );
};

export default Icon;

// Check Icon List here: https://lucide.dev/icons/
