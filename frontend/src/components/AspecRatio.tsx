import { AspectRatioProps, Root } from '@radix-ui/react-aspect-ratio';

const AspectRatio = ({ ratio, children, ...props }: AspectRatioProps) => {
  return (
    <Root ratio={ratio} {...props}>
      {children}
    </Root>
  );
};

export default AspectRatio;

// Better with Next/Image
