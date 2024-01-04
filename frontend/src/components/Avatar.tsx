import { ComponentPropsWithoutRef, ElementRef, ReactNode, forwardRef } from 'react';
import { cn } from '@/utils/classes';
import { Root, Image, Fallback } from '@radix-ui/react-avatar';

const AvatarContainer = forwardRef<ElementRef<typeof Root>, ComponentPropsWithoutRef<typeof Root>>(({ className, ...props }, ref) => (
  <Root ref={ref} className={cn('relative flex shrink-0 overflow-hidden rounded-full', className)} {...props} />
));
AvatarContainer.displayName = Root.displayName;

const AvatarImage = forwardRef<ElementRef<typeof Image>, ComponentPropsWithoutRef<typeof Image>>(({ className, ...props }, ref) => (
  <Image ref={ref} className={cn('aspect-square h-full w-full', className)} {...props} />
));
AvatarImage.displayName = Image.displayName;

const AvatarFallback = forwardRef<ElementRef<typeof Fallback>, ComponentPropsWithoutRef<typeof Fallback>>(({ className, ...props }, ref) => (
  <Fallback ref={ref} className={cn('flex h-full w-full items-center justify-center rounded-full bg-muted', className)} {...props} />
));
AvatarFallback.displayName = Fallback.displayName;

export { AvatarContainer, AvatarImage, AvatarFallback };

interface AvatarProps extends ComponentPropsWithoutRef<typeof Root> {
  children?: ReactNode;
  src?: string;
  fallback: string;
}

const Avatar = ({ children, src, fallback, ...props }: AvatarProps) => {
  return (
    <AvatarContainer {...props}>
      <AvatarImage src={src} />
      <AvatarFallback>{fallback}</AvatarFallback>
      {children}
    </AvatarContainer>
  );
};

export default Avatar;
