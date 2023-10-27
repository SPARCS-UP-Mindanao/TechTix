import { ComponentPropsWithRef } from "react";
import * as phosphorIcons from "@phosphor-icons/react";

type IconWeight = "thin" | "light" | "regular" | "bold" | "fill" | "duotone";
interface IconProps extends ComponentPropsWithRef<"svg"> {
  name: string;
  alt?: string;
  color?: string;
  size?: string | number;
  weight?: IconWeight;
  mirrored?: boolean;
}
type Icon = React.ForwardRefExoticComponent<IconProps>;

interface IconMap {
  [key: string]: any;
}

const Icon = ({
  name,
  color,
  size,
  weight,
  mirrored,
  className,
  ...props
}: IconProps) => {
  const icons: IconMap = phosphorIcons as IconMap;

  if (!name || !(name in icons)) {
    return;
  }

  const PhosphorIcon = icons[name];

  return (
    <PhosphorIcon
      name={name}
      color={color}
      size={size || 18}
      weight={weight || "bold"}
      mirrored={mirrored}
      className={className}
      {...props}
    />
  );
};

export default Icon;

// Check Icon List here: https://phosphoricons.com/
