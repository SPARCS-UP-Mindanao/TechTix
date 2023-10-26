import * as React from "react";
import { cn } from "@/utils/classes";
import Icon from "@/components/Icon";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";

const TooltipProvider = TooltipPrimitive.Provider;

const TooltipContainer = TooltipPrimitive.Root;

const TooltipTrigger = TooltipPrimitive.Trigger;

const TooltipArrow = () => {
  return (
    <span
      style={{
        position: "absolute",
        bottom: 1,
        transform: "translateY(100%)",
        left: 78.5,
      }}
    >
      <svg
        width="10"
        height="5"
        viewBox="0 0 30 10"
        preserveAspectRatio="none"
        style={{ display: "block" }}
      >
        <polygon points="0,0 30,0 15,10" />
      </svg>
    </span>
  );
};

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, side = "top", ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    side={side}
    className={cn(
      "z-50 overflow-hidden rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    )}
    {...props}
  />
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

export { TooltipContainer, TooltipTrigger, TooltipContent, TooltipProvider };

interface TooltipProps
  extends React.ComponentPropsWithoutRef<typeof TooltipContent> {
  toolTipContent: React.ReactNode;
  delayDuration?: number;
  skipDelayDuration?: number;
  defaultOpen?: boolean;
}

const Tooltip = ({
  children,
  toolTipContent,
  delayDuration = 300,
  skipDelayDuration = 300,
  defaultOpen = false,
  ...props
}: TooltipProps) => {
  return (
    <TooltipProvider
      delayDuration={delayDuration}
      skipDelayDuration={skipDelayDuration}
      disableHoverableContent
    >
      <TooltipContainer defaultOpen={defaultOpen}>
        <TooltipTrigger asChild>
          <div>{children}</div>
        </TooltipTrigger>
        <TooltipContent {...props} sideOffset={8}>
          <TooltipArrow />
          {toolTipContent}
        </TooltipContent>
      </TooltipContainer>
    </TooltipProvider>
  );
};

export default Tooltip;

export const InfoToolTip = ({ toolTipContent, ...props }: TooltipProps) => {
  return (
    <Tooltip toolTipContent={toolTipContent} {...props}>
      <Icon name="Info" className="text-primary" />
    </Tooltip>
  );
};
