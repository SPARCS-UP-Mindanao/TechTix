import { ComponentProps } from 'react';
import { icons, LucideProps } from 'lucide-react';
import { DynamicIcon, IconName as _IconName, dynamicIconImports } from 'lucide-react/dynamic';

type OldIcons = keyof typeof icons;
export type IconComponentAttributes = Omit<ComponentProps<typeof DynamicIcon>, 'name'>;

export type IconName = OldIcons;

interface IconProps extends LucideProps {
  name: OldIcons;
  color?: string;
  size?: number;
  className?: string | undefined;
}

const ICONS = [...Object.keys(dynamicIconImports)] as _IconName[];

const getNewIconName = (name: OldIcons) =>
  name
    // insert a dash before each uppercase letter, except at the start
    .replace(/([A-Z])/g, '-$1')
    // convert everything to lowercase
    .toLowerCase()
    // remove any leading dash if present
    .replace(/^-/, '');

const isIconAvailable = (name: string): name is _IconName => ICONS.includes(name as _IconName);
const Icon = ({ name, color, size, className, ...props }: IconProps) => {
  const newIconName = getNewIconName(name);

  if (!isIconAvailable(newIconName)) {
    return <></>;
  }

  return <DynamicIcon name={newIconName} color={color} size={size || 16} className={className} {...props} />;
};

export default Icon;
