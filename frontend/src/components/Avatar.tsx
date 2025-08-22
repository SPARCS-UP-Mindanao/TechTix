import * as React from 'react';
import { cn } from '@/utils/classes';
import * as AvatarPrimitive from '@radix-ui/react-avatar';

function AvatarContainer({ className, ...props }: React.ComponentProps<typeof AvatarPrimitive.Root>) {
  return <AvatarPrimitive.Root data-slot="avatar" className={cn('relative flex size-8 shrink-0 overflow-hidden rounded-full', className)} {...props} />;
}
function AvatarImage({ className, ...props }: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  return <AvatarPrimitive.Image data-slot="avatar-image" className={cn('aspect-square size-full', className)} {...props} />;
}
function AvatarFallback({ className, ...props }: React.ComponentProps<typeof AvatarPrimitive.Fallback>) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn('bg-muted flex size-full items-center justify-center rounded-full', className)}
      {...props}
    />
  );
}

function extractNameInitials(name: string): string {
  const nameParts = name.split(' ');

  if (nameParts.length === 2) {
    return `${nameParts[0][0]}${nameParts[1][0]}`;
  }

  if (nameParts.length > 2) {
    return `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`;
  }

  return name;
}

export { AvatarContainer, AvatarImage, AvatarFallback, extractNameInitials };

interface AvatarProps extends React.ComponentProps<typeof AvatarPrimitive.Root> {
  children?: React.ReactNode;
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
