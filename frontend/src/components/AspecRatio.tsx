import * as AspectRatioPrimitive from "@radix-ui/react-aspect-ratio";

const AspectRatio = ({
  ratio,
  children,
  ...props
}: AspectRatioPrimitive.AspectRatioProps) => {
  return (
    <AspectRatioPrimitive.Root ratio={ratio} {...props}>
      {children}
    </AspectRatioPrimitive.Root>
  );
};

export default AspectRatio;

// Better with Next/Image
